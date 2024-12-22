import { getFieldIds } from '../../../utils'
import { ListHooks } from '../types'
import { commonAfterOp } from './common'

export const typeHooks: ListHooks<'type'> = {
  fields: {
    parameterData: {
      resolveInput: async ({ context, resolvedData, fieldKey }) => {
        if (!resolvedData[fieldKey]?.disconnect) return
        const skipList: any[] = []
        const lists = await context.query.IgnoreList.findMany({
          where: {
            parameterData: {
              id: { in: getFieldIds(resolvedData[fieldKey].disconnect) },
            },
          },
          query: 'id, type {id}, taggedAs, parameterData {id}',
        })

        lists.forEach((item) => {
          if (item.taggedAs === 'spamData') {
            skipList.push(item.parameterData.id)
          }
        })

        resolvedData[fieldKey].disconnect = resolvedData[fieldKey].disconnect?.filter(
          (item: { id: string }) => !skipList.includes(item.id),
        )
        return resolvedData[fieldKey]
      },
      afterOperation: async ({ context, fieldKey, resolvedData, operation, item }) => {
        if (operation === 'update') {
          if (resolvedData[fieldKey]?.disconnect?.length) {
            const lists = await context.query.IgnoreList.findMany({
              where: {
                parameterData: {
                  id: { in: getFieldIds(resolvedData[fieldKey].disconnect) },
                },
              },
              query: 'id, type {id}',
            })

            const data = lists.map((list) => ({
              where: { id: list.id },
              data: Object.assign(
                {},
                {
                  type: {
                    disconnect: [{ id: item.id }],
                  },
                },
                list.type.length > 1
                  ? {}
                  : {
                      status: false,
                    },
              ),
            }))

            if (data.length)
              context.query.IgnoreList.updateMany({
                data,
              })

            context.session.fromType = true
          }
        }
      },
    },
  },
  list: {
    afterOperation: (data) => commonAfterOp('type', data),
  },
}
