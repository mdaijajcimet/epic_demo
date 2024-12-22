/* eslint-disable @typescript-eslint/no-explicit-any */
import { DecimalFieldConfig, decimal } from '@keystone-6/core/fields'
import type {
  BaseKeystoneTypeInfo,
  BaseListTypeInfo,
  KeystoneContext,
  MaybeItemFunction,
} from '@keystone-6/core/types'
import { CsvError } from 'csv-parse/sync'
import dayjs from 'dayjs'
import type { Response } from 'express'
import { compact, concat, differenceWith, includes, isEmpty, map, toLower, uniqBy } from 'lodash'

import { ErrorWithStatusCode } from '../libs/errors'
import type { FieldConfig } from '../types'
import type { AccessArgs } from '../types/access'
import type { Maybe } from '../types/utils'

export const numberKeys = ['addonId', 'planId', 'providerId', 'contactNumber']

export const getTableId = async (context: any, table: any, key: any) => {
  return await context.query?.[table].findMany({
    where: {
      name: { equals: key },
    },
    query: 'id',
  })
}

export const generateSectionData = async (item: any, context: any) => {
  if (item?.section) {
    let sections = JSON.parse(item.section) || []
    if (!isEmpty(sections)) {
      sections = sections?.map((section: any) => {
        if (section.content) section.content = section?.content?.document || []
        return section
      })
    }
    const data = await Promise.all(
      sections?.map(async (item: any) => {
        const section = await context.prisma.section.create({
          data: item,
        })
        return section.id
      }),
    )
    return data
  }
  return null
}

export const generatePageData = (item: any, domainId: any, verticalId: any, sectionIds: any) => {
  if (item.content) item.content = JSON.parse(item.content).document
  if (!isEmpty(sectionIds)) {
    item.section = { connect: sectionIds.map((sectionId: any) => ({ id: sectionId })) }
  }
  item.domain = { connect: { id: domainId } }
  item.vertical = { connect: { id: verticalId } }
  item.type = item.type || 'articles'
  return item
}

export const createRecords = async (dataList: any, context: any, table: any, filterKey: any) => {
  let keys = dataList?.map((item: any) => item?.[filterKey])
  keys = includes(numberKeys, filterKey) ? keys.map(Number) : keys

  const existingKeys = await context.query?.[table].findMany({
    where: { [filterKey]: { in: keys } },
    query: filterKey,
  })

  const mappedKeys = keys.map((key: any) => ({ [filterKey]: key }))

  const notExistingKeys = differenceWith(
    mappedKeys,
    existingKeys,
    (x: any, y: any) => toLower(x?.[filterKey]) === toLower(y?.[filterKey]),
  )

  const newData = notExistingKeys
    ?.map((item) => dataList.find((x: any) => x?.[filterKey] === item?.[filterKey]))
    ?.map((item) => {
      if (item?.content) {
        item.content = JSON.parse(item.content)
      }
      const updatedItem = Object.keys(item).reduce(
        (acc, key) => (item[key] ? { ...acc, [key]: item[key] } : acc),
        {},
      )
      return updatedItem
    })

  return newData?.length
    ? await context.db?.[table].createMany({
        data: newData,
      })
    : []
}

export const createPages = async (dataList: any, context: any, options: any) => {
  const { domain, vertical, table } = options

  const urlKeys = compact(dataList?.map((item: any) => item?.url)) || []
  const slugKeys = compact(dataList?.map((item: any) => item?.slug)) || []

  const existingKeys = await context.query?.[table].findMany({
    where: {
      domain: { name: { equals: domain } },
      vertical: { name: { equals: vertical } },
      OR: [
        {
          slug: { in: slugKeys },
        },
        {
          url: { in: urlKeys },
        },
      ],
    },
    query: 'slug',
  })

  const domainObj = (await getTableId(context, 'Domain', domain)) as any
  const domainId = domainObj[0]?.id

  const verticalObj = (await getTableId(context, 'Vertical', vertical)) as any
  const verticalId = verticalObj[0]?.id

  const mappedKeys = slugKeys?.map((key: any) => ({ slug: key }))

  const notExistingKeys = differenceWith(
    mappedKeys,
    existingKeys,
    (x: any, y: any) => toLower(x?.slug) === toLower(y?.slug),
  )

  const newPages = await Promise.all(
    notExistingKeys
      ?.map((item) => dataList.find((x: any) => x?.slug === item?.slug))
      ?.map(async (item) => {
        const sectionIds = await generateSectionData(item, context)
        const pageItem = generatePageData(item, domainId, verticalId, sectionIds) as any
        const updatedItem = Object.keys(pageItem).reduce(
          (acc, key) => (pageItem[key] ? { ...acc, [key]: pageItem[key] } : acc),
          {},
        )
        return updatedItem
      }),
  )
  return newPages?.length
    ? await context.db?.[table].createMany({
        data: newPages,
      })
    : []
}

export const createManufacturers = async (
  dataList: { manufacturer: string; modelNumber: string; approveDate: Date; expiryDate: Date }[],
  context: any,
) => {
  let manufacturers = dataList.map((item: { manufacturer: string }) => item.manufacturer)

  manufacturers = uniqBy(manufacturers, toLower)

  const existingManufacturers = await context.query.Manufacturer.findMany({
    where: { name: { in: manufacturers } },
    query: 'name',
  })

  const mappedManufacturers = manufacturers.map((name: any) => ({ name }))

  const notExistingManufacturers = differenceWith(
    mappedManufacturers,
    existingManufacturers,
    (x: { name: string }, y: { name: string }) => toLower(x.name) === toLower(y.name),
  )

  return notExistingManufacturers.length
    ? await context.db.Manufacturer.createMany({
        data: notExistingManufacturers,
      })
    : []
}

export async function formatData(data: any, context: KeystoneContext<BaseKeystoneTypeInfo>) {
  const manufacturers = await context.query.Manufacturer.findMany({ query: 'id name' })
  const formattedData: any[] = []

  data.forEach((item: any) => {
    const approveDate = dayjs(item.approveDate, 'DD/MM/YYYY')
    const expiryDate = dayjs(item.expiryDate, 'DD/MM/YYYY')
    if (!approveDate.isValid() || !expiryDate.isValid()) return

    if (item?.tested) delete item.tested

    const exists = manufacturers.find(
      (b: any) => b.name.trim().toLowerCase() == item.manufacturer.trim().toLowerCase(),
    )

    if (exists) {
      item.manufacturer = { connect: { id: exists.id } }
    }

    if (item.powerRating) {
      item.powerRating = parseFloat(item.powerRating)
    }

    item.approveDate = approveDate.format('YYYY-MM-DD')
    item.expiryDate = expiryDate.format('YYYY-MM-DD')
    formattedData.push(item)
  })

  return formattedData
}

export const createSolarPanelData = async (dataList: any, context: any) => {
  let modelNumbers = dataList.map((item: any) => item.modelNumber)
  const existingSolarPanels = await context.query.SolarPanel.findMany({
    where: { modelNumber: { in: modelNumbers } },
    query: 'modelNumber',
  })
  modelNumbers = modelNumbers.map((modelNumber: any) => ({ modelNumber }))

  const uniqueSolarPanels = differenceWith(
    dataList,
    existingSolarPanels,
    (x: { modelNumber: string }, y: { modelNumber: string }) =>
      toLower(x.modelNumber) === toLower(y.modelNumber),
  )

  return uniqueSolarPanels.length
    ? await context.query.SolarPanel.createMany({
        data: uniqueSolarPanels,
        query: 'id modelNumber series approveDate expiryDate',
      })
    : []
}

export const createInverterData = async (dataList: any, context: any) => {
  let modelNumbers = map(dataList, 'modelNumber')

  const existingInverters = await context.query.Inverter.findMany({
    where: { modelNumber: { in: modelNumbers } },
    query: 'modelNumber',
  })

  modelNumbers = modelNumbers.map((modelNumber: any) => ({ modelNumber }))

  const uniqueInverters = differenceWith(
    dataList,
    existingInverters,
    (x: { modelNumber: string }, y: { modelNumber: string }) =>
      toLower(x.modelNumber) === toLower(y.modelNumber),
  )

  return uniqueInverters.length
    ? await context.query.Inverter.createMany({
        data: uniqueInverters,
        query: 'id modelNumber series powerRating approveDate expiryDate',
      })
    : []
}

export const customDecimal = (
  options?: DecimalFieldConfig<any>,
  validations?: { min?: string; max?: string; isRequired?: boolean },
) => decimal({ scale: 2, validation: { min: '0', ...validations }, ...options })

export const getRelationshipFieldIds = async (
  id: string | string[] | undefined,
  table: string,
  field: string,
  context: KeystoneContext<BaseKeystoneTypeInfo>,
) => {
  const ids = concat([], id)
  const fieldIds = await context.prisma?.[table]?.findMany({
    where: {
      [field]: {
        some: {
          id: {
            in: ids,
          },
        },
      },
    },
    select: {
      id: true,
    },
  })
  return getFieldIds(fieldIds)
}

type GetFieldIdArr = Maybe<{ id?: string } & Record<string, unknown>>[]

export const getFieldIds = (arr: GetFieldIdArr = []) =>
  arr.reduce((acc: string[], item) => (item?.id ? [...acc, item.id] : acc), [])

/**
 * Only for FIELDS.
 *
 * It accepts Keystone UI props and returns readOnly UI
 **/
export const readOnly = (
  uiConfig: FieldConfig<'ui'> & { labelField?: string } = {},
  fieldPosition?: MaybeItemFunction<'form' | 'sidebar', BaseListTypeInfo>,
): FieldConfig<'ui'> => ({
  ...uiConfig,
  createView: {
    fieldMode: 'hidden',
  },
  itemView: {
    fieldMode: 'read',
    fieldPosition,
  },
})

export type KeystoneArgs = Parameters<
  Exclude<MaybeItemFunction<'edit' | 'read' | 'hidden', BaseListTypeInfo>, string>
>[0] & { item?: BaseListTypeInfo['item'] }
/**
 * Hides field from view.
 **/
export const hideFieldFromView = ({
  conditionCB,
  fieldPosition,
  alternativeFieldMode = 'edit',
}: {
  conditionCB?: (args: AccessArgs, viewType: 'create' | 'item' | 'list') => boolean
  alternativeFieldMode?: 'edit' | 'read'
  fieldPosition?: MaybeItemFunction<'form' | 'sidebar', BaseListTypeInfo>
} = {}): FieldConfig<'ui'> => ({
  createView: {
    fieldMode(args) {
      if (!conditionCB) return 'hidden'
      return conditionCB(args, 'create') ? 'hidden' : 'edit'
    },
  },
  itemView: {
    fieldPosition: fieldPosition,
    fieldMode(args) {
      if (!conditionCB) return 'hidden'

      return conditionCB(args, 'item') ? 'hidden' : alternativeFieldMode ?? 'edit'
    },
  },
  listView: {
    fieldMode(args) {
      if (!conditionCB) return 'hidden'
      return conditionCB(args, 'list') ? 'hidden' : 'read'
    },
  },
})

export const getErrorMessage = (error: unknown, defaultVal = 'Something Went Wrong!') => {
  if (!error) return defaultVal
  if (error instanceof CsvError) {
    switch (error.code) {
      case 'CSV_RECORD_INCONSISTENT_COLUMNS':
        return 'Columns not compatible with vertical!'
      default:
        return error.message
    }
  }
  if (error instanceof Error) return error.message
  if (typeof error === 'object') return isEmpty(error) ? defaultVal : JSON.stringify(error)

  return String(error)
}

export const handleCatchErr = (err: unknown, res: Response) => {
  if (err instanceof CsvError) {
    res.status(400).json({ message: getErrorMessage(err) || 'Invalid CSV file!' })
    return
  }
  if (err instanceof ErrorWithStatusCode) {
    res.status(err.statusCode).json({ message: err.message })
    return
  }
  res.status(500).json({ message: getErrorMessage(err) })
  return
}

export const checkEnvVariables = () => {
  /**
   *  these variables are required at bulild time for build to success.
   *
   *  Add the variable in dockerFile as
   *
   *    ARG CIMET_API_KEY
   *
   *    ENV CIMET_API_KEY={CIMET_API_KEY}
   *
   *  Additionally .github/workflows/[env_name]-build.yml > jobs>[env_name]_build>steps>env & run as per correct format
   *
   * Finally get the variables added in github env and sealed secrets
   **/
  const requiredEnvVariables = ['DATABASE_URL', 'CIMET_API_KEY', 'FALCON_API_URL']
  const missingEnvVariables = requiredEnvVariables.filter((env) => !process.env[env])
  if (missingEnvVariables.length)
    throw new Error(`Missing required environment variables: ${missingEnvVariables.join(', ')}`)
}
