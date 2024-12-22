import isNil from 'lodash/isNil'
import { ListHookFuncArgs } from './src/types'

type RelationItem = {
  [key: string]: string
}

const NA = 'N/A'
const reduceRelationArrToStr = (relationValue: Array<RelationItem>, initVal: string): string =>
  Array.isArray(relationValue) && relationValue.length
    ? relationValue.reduce(
        (acc: string, curr: RelationItem, index: number) =>
          `${acc}${index === 0 ? ' ' : ', '}${Object.values(curr)[0]}`,
        initVal ?? '',
      )
    : ''

const registerAuditLog = async (input: ListHookFuncArgs<'afterOperation'>[0]) => {
  try {
    const { item, originalItem, operation, listKey, resolvedData, context } = input

    const userId = context?.session?.itemId ?? 'changed via script'

    const { name: username } = context?.session?.data?.name ? context.session.data : 'script'

    const commonLogData = {
      userId,
      username,
      collectionName: listKey,
      docId: item?.id ?? originalItem?.id,
      actionType: operation,
    }

    const data = []

    if (operation === 'update') {
      // for one-to-many or many-to-many relation updates
      for (const key in resolvedData) {
        if (Object.prototype.hasOwnProperty.call(resolvedData, key) && key !== 'id') {
          if (resolvedData[key]?.connect) {
            const connections = reduceRelationArrToStr(resolvedData[key].connect, 'added connections:')
            const disConnections = reduceRelationArrToStr(
              resolvedData[key].disconnect,
              'removed connections:',
            )
            if (connections || disConnections) {
              data.push({
                ...commonLogData,
                attributeName: key,
                oldValue: disConnections || NA,
                newValue: connections || NA,
              })
            }
          }
        }
      }
      // for one-to-one relation or other fields updates
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key) && key !== 'id') {
          const newValue = !isNil(item?.[key]) ? JSON.stringify(item?.[key]) : null
          const oldValue = !isNil(originalItem?.[key]) ? JSON.stringify(originalItem?.[key]) : null
          if ((newValue || oldValue) && newValue !== oldValue) {
            data.push({
              ...commonLogData,
              attributeName: key,
              oldValue: oldValue ?? NA,
              newValue: newValue ?? NA,
            })
          }
        }
      }
    } else {
      const isCreate = operation === 'create'
      const output = isCreate ? { ...item } : { ...originalItem }
      if (isCreate) {
        Object.keys(resolvedData).forEach((key) => {
          if (!Object.prototype.hasOwnProperty.call(item, key) && resolvedData[key]?.connect) {
            const connections = reduceRelationArrToStr(resolvedData[key]?.connect, 'added connections:')
            if (connections) output[key] = connections
          }
        })
      }
      data.push({
        ...commonLogData,
        attributeName: NA,
        oldValue: isCreate ? NA : JSON.stringify(output),
        newValue: isCreate ? JSON.stringify(output) : NA,
      })
    }

    context.query.AuditLog.createMany({ data })
  } catch (error) {
    console.error(JSON.stringify(error, null, 2))
  }
}

export default registerAuditLog
