import { FieldConfig } from '../../types'

export const DEFAULT_VERTICAL = 'non-specific'

// --- OPTIONS ---
export const PUBLICATION_STATUS = {
  published: { label: 'Published', value: 'published' },
  review: { label: 'In Review', value: 'review' },
  draft: { label: 'Draft', value: 'draft' },
  deleted: { label: 'Soft Delete', value: 'deleted' },
} as const

export const PAGE_TYPE = {
  landing: { label: 'Landing', value: 'landing' },
  home: { label: 'Home', value: 'home' },
  cobrand: { label: 'CoBrand', value: 'cobrand' },
  brand: { label: 'Brand', value: 'brands' },
  vic: { label: 'VIC', value: 'vic' },
  nsw: { label: 'NSW', value: 'nsw' },
  blogList: { label: 'Blog listing', value: 'blogListing' },
  article: { label: 'Articles', value: 'articles' },
  static: { label: 'Static', value: 'static' },
  career: { label: 'Careers', value: 'careers' },
}

export const META_ROBOTS = [
  { label: 'Index, Follow', value: 'index,follow' },
  { label: 'Index, No follow', value: 'index,nofollow' },
  { label: 'No index, Follow', value: 'noindex,follow' },
  { label: 'No index, No follow', value: 'noindex,nofollow' },
]

export const SEO_PERMISSION = {
  disallowed: { label: 'Disallow', value: 'disallowed' },
  allowed: { label: 'Allow', value: 'allowed' },
}

export const fieldUI: FieldConfig<'ui'> = {
  itemView: {
    fieldPosition: 'sidebar',
  },
}
