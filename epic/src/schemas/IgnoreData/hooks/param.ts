import { getFieldIds } from '../../../utils'
import { ListHooks } from '../types'
import { commonAfterOp } from './common'

/** For next iteration */
// also need to handle what happens with list data when param/type is deleted
// skipping this: If I remove a type from param table, all data regarding that type would get disabled (for test data only, not spam)
// export const typeHooks: FieldHooks<BaseListTypeInfo> = {
//   afterOperation: async ({ context, resolvedData, operation, fieldKey, item }) => {
//     if (operation === 'update') {
//       if (resolvedData[fieldKey]?.disconnect?.length) {
//         const lists = await context.query.IgnoreList.findMany({
//           where: {
//             type: {
//               id: { in: getFieldIds(resolvedData[fieldKey].disconnect) },
//             },
//             parameter: {
//               id: { equals: item.id },
//             },

//           },
//         })
//       }
//     }
//   },
// }
export const paramHooks: ListHooks<'parameter'> = {
  fields: {
    typeData: {
      afterOperation: async ({ context, fieldKey, resolvedData, operation }) => {
        if (operation === 'update') {
          if (resolvedData[fieldKey]?.disconnect?.length) {
            const lists = await context.query.IgnoreList.findMany({
              where: {
                parameterData: {
                  id: { in: getFieldIds(resolvedData[fieldKey].disconnect) },
                },
              },
              query: 'id',
            })

            context.query.IgnoreList.updateMany({
              data: lists.map((list) => ({
                where: { id: list.id },
                data: {
                  status: false,
                },
              })),
            })

            context.session.fromParam = true
          }
        }
      },
    },
  },
  list: {
    afterOperation: (data) => commonAfterOp('parameter', data),
  },
}
