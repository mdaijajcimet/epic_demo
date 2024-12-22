import { group, list } from '@keystone-6/core'
import { relationship, select, text, timestamp } from '@keystone-6/core/fields'
import { document } from '@keystone-6/fields-document'
import includes from 'lodash/includes'
import isUndefined from 'lodash/isUndefined'
import path from 'path'

import registerAuditLog from '../../../registerAuditLog'
import { componentBlocks } from '../../componentBlocks'
import { LIST_ACCESS_KEY_MAP } from '../../config/access'
import { TIMESTAMP_SCHEMA } from '../../constants/schema'
import buildSlug from '../../libs/buildSlug'
import fetchIngestorAPI from '../../libs/fetchIngestorAPI'
import { getModuleUIArgs } from '../../utils/access'
import { DEFAULT_VERTICAL, PAGE_TYPE, PUBLICATION_STATUS, fieldUI } from './constants'
import { getApproval, getCommonPageRules, getDefaultPageView, pageModuleAccess } from './utils'

export const Page = list({
  access: {
    operation: pageModuleAccess,
    filter: {
      query: (args) => {
        const AND = getCommonPageRules(args)
        return { AND }
      },
    },
  },
  fields: {
    // -------- Essentials ------

    ...group({
      label: 'Essentials',
      fields: {
        title: text({
          validation: { isRequired: true },
          hooks: {
            resolveInput: ({ resolvedData }) => {
              return resolvedData?.title?.trim()
            },
          },
        }),
        description: text(),
        domain: relationship({
          ref: 'Domain.pages',
          many: false,
          ui: {
            labelField: 'hostname',
          },
        }),
        vertical: relationship({
          ref: 'Vertical.pages',
          ui: {
            displayMode: 'select',
          },
        }),
        type: select({
          validation: { isRequired: true },
          options: Object.values(PAGE_TYPE),
        }),
        pageConfig: relationship({ ref: 'PageConfig.page', ui: { labelField: 'title' } }),
        slug: text({
          hooks: {
            resolveInput: ({ operation, resolvedData, inputData }) => {
              if (operation === 'create' && !inputData.slug) {
                return buildSlug(inputData.title)
              }

              return resolvedData?.slug?.trim()
            },
          },
        }),
        url: text(),
      },
    }),

    // -------- Status ------

    status: select({
      options: Object.values(PUBLICATION_STATUS),
      defaultValue: PUBLICATION_STATUS.draft.value,
      validation: { isRequired: true },
      ui: {
        displayMode: 'segmented-control',
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: 'edit',
          fieldPosition: 'sidebar',
        },
      },
    }),

    // -------- Content ------

    ...group({
      label: 'Content',
      fields: {
        content: document({
          formatting: true,
          layouts: [
            [1, 1],
            [1, 1, 1],
            [2, 1],
            [1, 2],
            [1, 2, 1],
          ],
          links: true,
          dividers: true,
          ui: {
            views: path.join(process.cwd(), './src/componentBlocks'),
          },
          componentBlocks,
        }),
        section: relationship({
          ref: 'Section.pages',
          many: true,
          ui: {
            displayMode: 'cards',
            cardFields: ['sectionName', 'sectionOrder', 'content'],
            inlineEdit: { fields: ['sectionName', 'sectionOrder', 'content'] },
            linkToItem: true,
            inlineConnect: true,
            inlineCreate: { fields: ['sectionName', 'sectionOrder', 'content'] },
            views: path.join(process.cwd(), './src/customFields/SortedCardRelationships'),
          },
        }),
        widgets: relationship({
          ref: 'Widget.pages',
          many: true,
        }),

        scripts: relationship({
          ref: 'Script.pages',
          many: true,
        }),
      },
    }),

    // -------- Article-specific ------

    ...group({
      label: 'Article Data',
      fields: {
        thumbnail: relationship({
          ref: 'Media',
          many: false,
        }),
        heroImage: relationship({
          ref: 'Media',
          many: false,
        }),
        subHead: text(),
        supportingText: text(),
        linkLabel: text(),
        linkUrl: text(),
        author: relationship({
          ref: 'User.pages',
          ui: {
            displayMode: 'cards',
            cardFields: ['name', 'email'],
            inlineEdit: { fields: ['name', 'email'] },
            linkToItem: true,
            inlineConnect: true,
          },
        }),
        publishDate: timestamp({
          ui: { ...fieldUI },
        }),
        tags: relationship({
          ref: 'Tag.pages',
          ui: {
            displayMode: 'select',
            ...fieldUI,
          },
          many: true,
        }),
      },
    }),

    // ------- Meta --------

    ...group({
      label: 'Meta Data',
      fields: {
        seoIndex: select({
          options: [
            { label: 'Disallow', value: 'disallowed' },
            { label: 'Allow', value: 'allowed' },
          ],
          defaultValue: 'allowed',
          label: 'Index Page in Sitemap',
          ui: {
            displayMode: 'segmented-control',
            ...fieldUI,
          },
        }),
        metaRobots: select({
          label: 'Meta Tag for Robots',
          validation: { isRequired: true },
          options: [
            { label: 'Index, Follow', value: 'index,follow' },
            { label: 'Index, No follow', value: 'index,nofollow' },
            { label: 'No index, Follow', value: 'noindex,follow' },
            { label: 'No index, No follow', value: 'noindex,nofollow' },
          ],
          defaultValue: 'index,follow',
          ui: { ...fieldUI },
        }),
      },
    }),

    // ------- Timestamp --------
    ...TIMESTAMP_SCHEMA,
  },
  ui: {
    ...getDefaultPageView(),
    ...getModuleUIArgs(LIST_ACCESS_KEY_MAP.Page),
  },
  hooks: {
    resolveInput: async (data) => {
      const { operation, resolvedData, context, item } = data

      /**
       * Prevents update of soft-deleted page before user manually refreshes after soft-delete
       * Since keystone has no option to refresh a page from hooks (or) trigger UI ItemView args change callback
       *  */
      if (isUndefined(resolvedData.status) && item?.status === PUBLICATION_STATUS.deleted.value) {
        const resolvedKeys = Object.keys(resolvedData).filter((key) => key !== 'status' && resolvedData[key])
        if (resolvedKeys.length) return { error: `You can't update a deleted item. Please refresh page.` }
      }

      const slug = resolvedData.slug || item?.slug
      const verticalId =
        resolvedData.vertical?.connect?.id || (!resolvedData?.vertical?.disconnect && item?.verticalId)
      const domainId =
        resolvedData.domain?.connect?.id || (!resolvedData?.domain?.disconnect && item?.domainId)
      const type = resolvedData.type || item?.type

      if (!domainId || !type) {
        return { error: `please specify the required fields domain, type to proceed` }
      }

      let verticalSlug
      if (verticalId) {
        const { slug } = await context.query.Vertical.findOne({
          where: { id: verticalId },
          query: 'slug',
        })
        if (type === PAGE_TYPE.landing.value && slug === DEFAULT_VERTICAL)
          return { error: "vertical can't be non-specific for landing pages" }
        verticalSlug = slug
      } else {
        if (type === PAGE_TYPE.landing.value) return { error: `please specify the vertical` }
        const defaultVertical = await context.query.Vertical.findOne({
          where: { slug: DEFAULT_VERTICAL },
          query: 'id',
        })
        if (defaultVertical?.id) {
          resolvedData.vertical = { connect: { id: defaultVertical.id } }
          verticalSlug = DEFAULT_VERTICAL
        } else {
          return { error: `please specify the vertical` }
        }
      }

      if (!resolvedData.url || !item?.url) {
        if (type === PAGE_TYPE.home.value) {
          resolvedData.url = `/`
        } else if (type === PAGE_TYPE.landing.value) {
          resolvedData.url = `/${verticalSlug}`
        } else if (
          [PAGE_TYPE.brand.value, PAGE_TYPE.nsw.value, PAGE_TYPE.vic.value, PAGE_TYPE.career.value].includes(
            type,
          )
        ) {
          resolvedData.url = `/${type}/${slug}`
        } else if (type === PAGE_TYPE.article.value) {
          resolvedData.url =
            verticalSlug === DEFAULT_VERTICAL ? `/blogs/${slug}` : `/${verticalSlug}/blogs/${slug}`
        } else if (type === PAGE_TYPE.blogList.value) {
          resolvedData.url = verticalSlug === DEFAULT_VERTICAL ? `/blogs` : `/${verticalSlug}/blogs`
        } else if (verticalSlug === DEFAULT_VERTICAL) {
          resolvedData.url = `/${slug}`
        } else {
          resolvedData.url = `/${verticalSlug}/${slug}`
        }
      }

      if (operation === 'create') {
        const page = await context.prisma.page.findFirst({
          where: {
            url: {
              equals: resolvedData.url,
            },
            domainId,
          },
        })

        if (page) {
          return {
            error: 'Page already exists under the same domain',
          }
        }
      }

      return getApproval(data)
    },
    validate: ({ addValidationError, resolvedData }) => {
      if (resolvedData?.error) {
        addValidationError(resolvedData.error)
      }
    },
    afterOperation: async (data) => {
      const { operation, item, originalItem } = data
      const promises = []
      promises.push(registerAuditLog(data))
      // Page is present on ES and is currently live on the website
      const isCurrentlyLive = originalItem?.status === PUBLICATION_STATUS.published.value

      /**
       * Update Live Ingestor
       * when the Status is Published
       * Or, when Status is Deleted(Soft-Delete) but it is Live
       * Or, when we delete a Live Page from Epic(Hard-Delete)
       */
      type Status = (typeof PUBLICATION_STATUS)[keyof typeof PUBLICATION_STATUS]['value']
      const updateStatus = item?.status as Status
      if (
        (operation === 'delete' && isCurrentlyLive) ||
        (!includes([PUBLICATION_STATUS.review.value, PUBLICATION_STATUS.draft.value], updateStatus) &&
          // including soft-delete since page will be live if status goes from publish > review/draft > soft-delete
          (includes([PUBLICATION_STATUS.published.value, PUBLICATION_STATUS.deleted.value], updateStatus) ||
            originalItem?.status === PUBLICATION_STATUS.published.value))
      )
        promises.push(
          fetchIngestorAPI('ingest', {
            operation: item?.status === PUBLICATION_STATUS.published.value ? operation : 'delete',
            type: 'page',
            data: { ids: [item?.id.toString() ?? originalItem?.id?.toString()] },
          }),
        )
      await Promise.all(promises)
    },
  },
})
