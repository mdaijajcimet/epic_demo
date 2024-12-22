import { list } from '@keystone-6/core'
import { integer, relationship, text } from '@keystone-6/core/fields'
import { document } from '@keystone-6/fields-document'
import compact from 'lodash/compact'
import uniq from 'lodash/uniq'
import path from 'path'

import registerAuditLog from '../../../registerAuditLog'
import { componentBlocks } from '../../componentBlocks'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import fetchIngestorAPI from '../../libs/fetchIngestorAPI'
import { getModuleUIArgs } from '../../utils/access'
import { addIdsToObjectArrays } from '../../utils/addIdsToObjectArrays'
import { PUBLICATION_STATUS } from './constants'
import { getDefaultPageView, hasPagePermission, pageModuleAccess } from './utils'

export const Section = list({
  access: {
    operation: pageModuleAccess,
  },
  fields: {
    sectionName: text({ validation: { isRequired: true } }),
    sectionOrder: integer(),
    content: document({
      formatting: true,
      links: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1],
      ],
      dividers: true,
      ui: {
        views: path.join(process.cwd(), './src/componentBlocks'),
      },
      componentBlocks,
    }),
    pages: relationship({ ref: 'Page.section' }),

    // ------- Timestamp --------
    ...TIMESTAMP_SCHEMA,
  },
  ui: {
    labelField: 'sectionName',
    ...getDefaultPageView('pageElement'),
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Section),
  },
  hooks: {
    afterOperation: async (data) => {
      const { context, item, originalItem, listKey } = data

      const ids = uniq(compact([item?.pagesId, originalItem?.pagesId]))

      const promises = []
      /**
       *  if any pages are connected / were previously connected to the section
       *  and any of the pages is published
       *  then update Elastic Index if a publisher has changed data
       *  else set Pulished pages to Review
       * */
      if (ids.length) {
        if (hasPagePermission({ context, session: context.session, item, listKey }, ['publisher'])) {
          const pages = await context.query.Page.findMany({
            where: {
              id: { in: ids },
            },
            query: 'id, status',
          })
          const updatedPages = pages.reduce(
            (acc: string[], page) =>
              page.status === PUBLICATION_STATUS.published.value ? [...acc, page.id] : acc,
            [],
          )

          if (updatedPages.length)
            promises.push(
              fetchIngestorAPI('ingest', {
                operation: 'update',
                type: 'page',
                data: { ids: updatedPages },
              }),
            )
        } else
          promises.push(
            context.prisma.page.updateMany({
              where: {
                AND: [
                  {
                    id: {
                      in: ids,
                    },
                  },
                  {
                    status: {
                      equals: PUBLICATION_STATUS.published.value,
                    },
                  },
                ],
              },
              data: { status: PUBLICATION_STATUS.review.value },
            }),
          )
      }

      promises.push(registerAuditLog(data))
      await Promise.all(promises)
    },
    resolveInput: ({ resolvedData, operation }) => {
      if (['create', 'update'].includes(operation)) {
        const modifiedData = {
          ...resolvedData,
          content: resolvedData?.content?.map((item: any) => {
            if (item.type === 'component-block') {
              const modifiedComponentBlock = { ...item }
              modifiedComponentBlock.props = addIdsToObjectArrays(item.props)
              return modifiedComponentBlock
            }
            return item
          }),
        }
        return modifiedData
      }
      return resolvedData
    },
  },
})
