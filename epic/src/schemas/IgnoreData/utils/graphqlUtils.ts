import { differenceWith, isEqual, omit, uniqBy } from 'lodash'
import { Context, DeleteManyArgs, GQLCommonArgs, UpdateManyArgs } from '../../../types'
import { UpdatedItem } from '../types'

export const updateTypeInParamTable = async (context: Context, paramIds: string[]) => {
  const [existingData, paramData] = await Promise.all([
    context.query.IgnoreParameter.findMany({
      where: { id: { in: paramIds } },
      query: 'id, type {id}',
    }),
    context.query.IgnoreList.findMany({
      where: {
        parameter: { id: { in: paramIds } },
        taggedAs: {
          equals: 'testData',
        },
        status: { equals: true },
      },
      query: 'parameter {id}, type {id}',
    }),
  ])

  const paramDataMap = paramData.reduce((acc, item) => {
    if (!acc[item.parameter.id]) return { ...acc, [item.parameter.id]: item.type }
    return {
      ...acc,
      [item.parameter.id]: uniqBy([...acc[item.parameter.id], ...item.type], 'id'),
    }
  }, {})

  const updatedParamData = existingData.reduce((acc: UpdatedItem[], item) => {
    const typeArr = paramDataMap[item.id]
    const connect = differenceWith(typeArr, item.type, isEqual)
    const disconnect = differenceWith(item.type, typeArr, isEqual)

    if (connect.length || disconnect.length) {
      const updatedParam: UpdatedItem = { id: item.id }
      if (connect.length) updatedParam.connect = connect
      if (disconnect.length) updatedParam.disconnect = disconnect
      return [...acc, updatedParam]
    }
    return acc
  }, [])

  if (updatedParamData.length)
    return await updateMany({
      context,
      listKey: 'ignoreParameter',
      data: updatedParamData.map((param) => ({
        where: {
          id: param.id,
        },
        data: {
          type: {
            ...omit(param, 'id'),
          },
        },
      })),
    })
}

export const updateMany = async ({ context, listKey, data, select }: GQLCommonArgs & UpdateManyArgs) => {
  try {
    const response = await Promise.all(
      data.map(
        async (item) => await context.prisma[listKey].update(select ? { ...item, select } : { ...item }),
      ),
    )
    return { success: true, response }
  } catch (error) {
    console.error(`error in ${listKey} update`, error)
    return { success: false, error }
  }
}

export const deleteManyData = async ({ context, listKey, ids }: GQLCommonArgs & DeleteManyArgs) => {
  try {
    const response = await Promise.allSettled(
      ids.map(
        async (id) =>
          await context.prisma[listKey].delete({
            where: { id },
          }),
      ),
    )
    return { success: true, response }
  } catch (error) {
    console.error(`error in ${listKey} update`, error)
    return { success: false, error }
  }
}
