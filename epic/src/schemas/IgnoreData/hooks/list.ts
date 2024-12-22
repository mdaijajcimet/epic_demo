import compact from 'lodash/compact'
import isEmpty from 'lodash/isEmpty'
import isUndefined from 'lodash/isUndefined'
import omit from 'lodash/omit'

import registerAuditLog from '../../../../registerAuditLog'
import fetchIngestorAPI from '../../../libs/fetchIngestorAPI'
import { Data } from '../../../types'
import { getFieldIds } from '../../../utils'
import { validateMultiRelations, validateSingleRelations } from '../../Common/utils/relationshipValidators'
import { ListHooks } from '../types'
import { updateMany, updateTypeInParamTable } from '../utils'
import { deleteManyData } from '../utils/graphqlUtils'
import { getDataValidation } from '../utils/validator'

const ignoreListHooks: ListHooks<'list'> = {
  fields: {
    type: {
      resolveInput: async ({ resolvedData, context, item, operation }) => {
        if (resolvedData.taggedAs && resolvedData.taggedAs === 'spamData') {
          const allTypes = await context.query.IgnoreType.findMany({ query: 'id' })

          const listData =
            operation === 'update'
              ? await context.query.IgnoreList.findOne({
                  where: { id: resolvedData?.id?.toString() || item?.id.toString() },
                  query: 'type { id }',
                })
              : {}

          const ids = getFieldIds(listData?.type ?? [])
          resolvedData.type = {
            connect: operation === 'update' ? allTypes.filter((item) => !ids.includes(item.id)) : allTypes,
          }
        }
        return resolvedData.type
      },
    },
  },
  list: {
    resolveInput: async ({ resolvedData, operation, inputData, item, context }) => {
      if (operation === 'create') {
        if (resolvedData.parameterContent && resolvedData.parameter) {
          const parameter = await context.query.IgnoreParameter.findOne({
            where: { id: resolvedData.parameter?.connect?.id },
            query: 'name',
          })

          const validation = getDataValidation(parameter?.name, resolvedData.parameterContent)
          if (!validation.valid) return validation
        } else {
          return { error: `Valid parameter (or) parameter Content are required` }
        }
      }

      if (operation === 'update') {
        if (
          ((inputData.taggedAs && inputData.taggedAs === 'spamData') ||
            (!inputData.taggedAs && item.taggedAs === 'spamData')) &&
          resolvedData?.type?.disconnect
        ) {
          return { error: `Types can't be removed when data is spam` }
        }

        if (inputData?.parameterContent || inputData?.parameter) {
          const parameter = (await context.query.IgnoreParameter.findOne({
            where: { id: inputData?.parameter ? resolvedData.parameter?.connect?.id : item?.parameterId },
            query: 'name',
          })) as { name: string }

          const parameterContent = inputData?.parameterContent ?? item?.parameterContent

          const validation = getDataValidation(parameter?.name, parameterContent)
          if (!validation.valid) return validation

          if (inputData?.parameterContent) {
            await context.query.IgnoreDataContent.updateOne({
              where: { id: item.parameterDataId as string },
              data: { text: resolvedData.parameterContent },
            })
          }
          return resolvedData
        }
      }

      return resolvedData
    },
    validate: async (args) => {
      if (args.operation === 'delete') return
      const { addValidationError, resolvedData } = args
      if (resolvedData.error) {
        return addValidationError(resolvedData.error)
      }
      validateSingleRelations(args, ['parameter'])
      validateMultiRelations(args, ['type'])
    },

    afterOperation: async (args) => {
      const { resolvedData, operation, originalItem, item: updatedItem, context } = args

      try {
        if (operation === 'delete') {
          try {
            const promises = []
            if (originalItem.parameterDataId && typeof originalItem.parameterDataId === 'string') {
              const exists = await context.query.IgnoreDataContent.findOne({
                where: { id: originalItem.parameterDataId },
              })

              if (exists)
                promises.push(
                  deleteManyData({
                    ids: [originalItem?.parameterDataId],
                    listKey: 'ignoreDataContent',
                    context,
                  }),
                )
            }

            if (originalItem.parameterId && typeof originalItem.parameterId === 'string')
              promises.push(updateTypeInParamTable(context, [originalItem.parameterId]))

            await Promise.all(promises)
            // TODO: re-check for return
          } catch (error) {
            console.error('ignore list delete error', error)
          }
        }

        if (operation === 'create') {
          try {
            const saved = await context.query.IgnoreList.updateOne({
              where: {
                id: updatedItem?.id.toString() || resolvedData.id,
              },
              data: {
                parameterData: {
                  create: {
                    text: updatedItem?.parameterContent || resolvedData.parameterContent,
                  },
                },
              },
              query: 'parameterData {id}',
            })

            await Promise.all([
              updateMany({
                context,
                listKey: 'ignoreParameter',
                data: [
                  {
                    where: { id: resolvedData.parameter?.connect?.id },
                    data: Object.assign(
                      {},
                      {
                        typeData: { connect: { id: saved?.parameterData?.id } },
                      },
                      resolvedData.taggedAs === 'testData'
                        ? {
                            type: {
                              connect: resolvedData.type.connect,
                            },
                          }
                        : {},
                    ),
                  },
                ],
              }),
              updateMany({
                context,
                listKey: 'IgnoreType',
                data: getFieldIds(resolvedData.type?.connect)?.map((id) => ({
                  where: { id },
                  data: Object.assign(
                    {},
                    {
                      parameterData: { connect: { id: saved?.parameterData?.id } },
                    },
                    resolvedData.taggedAs === 'testData'
                      ? {
                          parameter: {
                            connect: [resolvedData.parameter.connect],
                          },
                        }
                      : {},
                  ),
                })),
              }),
            ])
          } catch (error) {
            console.error('ignore list create error', error)
          }
        }

        if (operation === 'update') {
          const isEnabled = resolvedData.status ?? updatedItem.status
          if (
            !isUndefined(resolvedData.type) ||
            !isUndefined(resolvedData.parameter) ||
            resolvedData.taggedAs ||
            !isUndefined(resolvedData.status)
          ) {
            updateTypeInParamTable(
              context,
              compact([resolvedData.parameter?.connect?.id, originalItem.parameterId]),
            )
          }

          if (!isUndefined(resolvedData.parameter) || !isUndefined(resolvedData.status)) {
            try {
              const data: { id: string; typeData: any }[] = []
              const originalParamId = originalItem.parameterId as string

              if (
                (resolvedData.parameter && originalItem.status) ||
                (!isEnabled && !context.session.fromParam)
              ) {
                data.push({
                  id: originalParamId,
                  typeData: {
                    disconnect: [
                      {
                        id: updatedItem?.parameterDataId,
                      },
                    ],
                  },
                })
              }

              if ((resolvedData.parameter && isEnabled) || resolvedData.status) {
                data.push({
                  id: updatedItem?.parameterId as string,
                  typeData: {
                    connect: [
                      {
                        id: updatedItem.parameterDataId as string,
                      },
                    ],
                  },
                })
              }

              if (data.length)
                updateMany({
                  context,
                  listKey: 'ignoreParameter',
                  data: data.map((item) => ({
                    where: { id: item.id },
                    data: {
                      ...omit(item, 'id'),
                    },
                  })),
                })
            } catch (error) {
              console.error('ignore parameter:', error)
            }
          }

          // current type where - when data or type is updated
          if (
            !isUndefined(resolvedData.type) ||
            (!isUndefined(resolvedData.status) && !context.session?.fromType)
          ) {
            try {
              const data: Data = []
              const connectIds: string[] = getFieldIds(resolvedData.type?.connect ?? [])
              const disconnectIds: string[] = getFieldIds(resolvedData.type?.disconnect ?? [])

              const listData = !isUndefined(resolvedData.status)
                ? await context.query.IgnoreList.findOne({
                    where: { id: updatedItem?.id.toString() || originalItem?.id.toString() },
                    query: 'type { id }',
                  })
                : { types: [] }

              const typeIds = [...connectIds, ...getFieldIds(listData.type)]

              if (!isEmpty(disconnectIds) && originalItem?.status) {
                // update parameter data on all diconnected type records
                disconnectIds?.forEach((id: string) => {
                  data.push({
                    where: { id },
                    data: {
                      parameterData: {
                        disconnect: [{ id: originalItem?.parameterDataId }],
                      },
                    },
                  })
                })
              }

              typeIds.forEach((id: string) => {
                data.push({
                  where: { id },
                  data: Object.assign(
                    {},
                    {
                      parameterData: isEnabled
                        ? { connect: [{ id: updatedItem?.parameterDataId }] }
                        : { disconnect: [{ id: originalItem?.parameterDataId }] },
                    },
                  ),
                })
              })

              // update type records
              if (data.length)
                updateMany({
                  context,
                  listKey: 'ignoreType',
                  data,
                })
            } catch (error) {
              console.error('ignore type', error)
            }
          }
        }
        //reset context session
        if (context?.session?.fromParam) context.session.fromParam = null
        if (context?.session?.fromType) context.session.fromType = null

        await Promise.all([
          fetchIngestorAPI('ingest', {
            operation,
            type: 'ignoredata',
            data: { ids: [updatedItem?.id.toString() || originalItem?.id.toString()] },
          }),
          registerAuditLog(args),
        ])
      } catch (error) {
        console.error('ignore list error', error)
      }
    },
  },
}

export { ignoreListHooks }
