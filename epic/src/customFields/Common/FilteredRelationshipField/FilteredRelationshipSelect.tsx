/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/** @jsxRuntime classic */
/** @jsx jsx */

import 'intersection-observer'
import { type RefObject, useEffect, useMemo, useState, createContext, useContext, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from '@keystone-ui/core'
import { MultiSelect, Select, selectComponents } from '@keystone-ui/fields'
import type { ListMeta } from '@keystone-6/core/types'
import {
  ApolloClient,
  gql,
  InMemoryCache,
  type TypedDocumentNode,
  useApolloClient,
  useQuery,
} from '@keystone-6/core/admin-ui/apollo'

function useIntersectionObserver(cb: IntersectionObserverCallback, ref: RefObject<any>) {
  const cbRef = useRef(cb)
  useEffect(() => {
    cbRef.current = cb
  })
  useEffect(() => {
    const observer = new IntersectionObserver((...args) => cbRef.current(...args), {})
    const node = ref.current
    if (node !== null) {
      observer.observe(node)
      return () => observer.unobserve(node)
    }
  }, [ref])
}

function useDebouncedValue<T>(value: T, limitMs: number) {
  const [debouncedValue, setDebouncedValue] = useState(() => value)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(() => value)
    }, limitMs)
    return () => clearTimeout(timeout)
  }, [value, limitMs])

  return debouncedValue
}

function isInt(x: string) {
  return Number.isInteger(Number(x))
}

function isBigInt(x: string) {
  try {
    BigInt(x)
    return true
  } catch {
    return true
  }
}

export function useFilter(
  search: string,
  list: ListMeta,
  searchFields: string[],
  extraFilters: Record<string, unknown>[],
) {
  return useMemo(() => {
    const trimmedSearch = search.trim()
    if (!trimmedSearch.length) return { OR: [], AND: extraFilters }

    const conditions: Record<string, any>[] = []
    const { type: idFieldType } = (list.fields.id.fieldMeta as any) ?? {}
    if (idFieldType === 'String') {
      conditions.push({ id: { equals: trimmedSearch } })
    } else if (idFieldType === 'Int' && isInt(trimmedSearch)) {
      conditions.push({ id: { equals: Number(trimmedSearch) } })
    } else if (idFieldType === 'BigInt' && isBigInt(trimmedSearch)) {
      conditions.push({ id: { equals: trimmedSearch } })
    } else if (idFieldType === 'UUID') {
      conditions.push({ id: { equals: trimmedSearch } }) // TODO: remove in breaking change?
    }

    if ((list.fields.id.fieldMeta as any)?.type === 'String') {
      conditions.push({ id: { equals: trimmedSearch } }) // why is this duplicated?
    }

    for (const fieldKey of searchFields) {
      const field = list.fields[fieldKey]
      conditions.push({
        [field.path]: {
          contains: trimmedSearch,
          mode: field.search === 'insensitive' ? 'insensitive' : undefined,
        },
      })
    }

    return { OR: conditions, AND: extraFilters }
  }, [search, list, searchFields, extraFilters])
}

const idFieldAlias = '____id____'
const labelFieldAlias = '____label____'

const LoadingIndicatorContext = createContext<{
  count: number
  ref: (element: HTMLElement | null) => void
}>({
  count: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  ref: () => {},
})

export const RelationshipSelect = ({
  autoFocus,
  controlShouldRenderValue,
  isDisabled,
  isLoading,
  list,
  labelField,
  searchFields,
  placeholder,
  portalMenu,
  state,
  // To query extra field for dropdown
  extraSelection = '',
  // Filtering data should be valid json containg valid queries for filter
  // eg: [{installer: null}, name: {contains: 'solar'}] or just object if single filter present {installer: null}
  extraFilters = [],
  emptyDropdown = false,
}: {
  autoFocus?: boolean
  controlShouldRenderValue: boolean
  isDisabled: boolean
  isLoading?: boolean
  searchFields: string[]
  list: ListMeta
  placeholder?: string
  portalMenu?: true | undefined
  labelField: string
  state:
    | {
        kind: 'many'
        value: { label: string; id: string; data?: Record<string, any> }[]
        onChange(value: { label: string; id: string; data: Record<string, any> }[]): void
      }
    | {
        kind: 'one'
        value: { label: string; id: string; data?: Record<string, any> } | null
        onChange(value: { label: string; id: string; data: Record<string, any> } | null): void
      }
  extraSelection?: string
  emptyDropdown?: boolean
  extraFilters?: Record<string, unknown>[]
}) => {
  const [search, setSearch] = useState('')

  const initialItemsToLoad = emptyDropdown ? 0 : 10
  const subsequentItemsToLoad = emptyDropdown ? 0 : 50

  // note it's important that this is in state rather than a ref
  // because we want a re-render if the element changes
  // so that we can register the intersection observer
  // on the right element
  const [loadingIndicatorElement, setLoadingIndicatorElement] = useState<null | HTMLElement>(null)

  const QUERY: TypedDocumentNode<
    { items: { [idFieldAlias]: string; [labelFieldAlias]: string | null }[]; count: number },
    { where: Record<string, any>; take: number; skip: number }
  > = gql`
    query RelationshipSelect($where: ${list.gqlNames.whereInputName}!, $take: Int!, $skip: Int!) {
      items: ${list.gqlNames.listQueryName}(where: $where, take: $take, skip: $skip) {
        ${idFieldAlias}: id
        ${labelFieldAlias}: ${labelField}
        ${extraSelection}
      }
      ${!emptyDropdown ? `count: ${list.gqlNames.listQueryCountName}(where: $where)` : ''}
    }
  `

  const debouncedSearch = useDebouncedValue(search, 200)
  const where = useFilter(debouncedSearch, list, searchFields, extraFilters)

  const link = useApolloClient().link
  // we're using a local apollo client here because writing a global implementation of the typePolicies
  // would require making assumptions about how pagination should work which won't always be right
  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        link,
        cache: new InMemoryCache({
          typePolicies: {
            Query: {
              fields: {
                [list.gqlNames.listQueryName]: {
                  keyArgs: ['where'],
                  merge: (existing: readonly unknown[], incoming: readonly unknown[], { args }) => {
                    const merged = existing ? existing.slice() : []
                    const { skip } = args!
                    for (let i = 0; i < incoming.length; ++i) {
                      merged[skip + i] = incoming[i]
                    }
                    return merged
                  },
                },
              },
            },
          },
        }),
      }),
    [link, list.gqlNames.listQueryName],
  )

  const { data, error, loading, fetchMore } = useQuery(QUERY, {
    fetchPolicy: 'network-only',
    variables: { where, take: initialItemsToLoad, skip: 0 },
    client: apolloClient,
  })

  const count = data?.count || 0

  const options =
    data?.items?.map(({ [idFieldAlias]: value, [labelFieldAlias]: label, ...data }) => ({
      value,
      label: label || value,
      data,
    })) || []

  const loadingIndicatorContextVal = useMemo(
    () => ({
      count,
      ref: setLoadingIndicatorElement,
    }),
    [count],
  )

  // we want to avoid fetching more again and `loading` from Apollo
  // doesn't seem to become true when fetching more
  const [lastFetchMore, setLastFetchMore] = useState<{
    where: Record<string, any>
    extraSelection: string
    list: ListMeta
    skip: number
  } | null>(null)

  useIntersectionObserver(
    ([{ isIntersecting }]) => {
      const skip = data?.items.length
      if (
        !loading &&
        skip &&
        isIntersecting &&
        options.length < count &&
        (lastFetchMore?.extraSelection !== extraSelection ||
          lastFetchMore?.where !== where ||
          lastFetchMore?.list !== list ||
          lastFetchMore?.skip !== skip)
      ) {
        const QUERY: TypedDocumentNode<
          { items: { [idFieldAlias]: string; [labelFieldAlias]: string | null }[] },
          { where: Record<string, any>; take: number; skip: number }
        > = gql`
              query RelationshipSelectMore($where: ${list.gqlNames.whereInputName}!, $take: Int!, $skip: Int!) {
                items: ${list.gqlNames.listQueryName}(where: $where, take: $take, skip: $skip) {
                  ${labelFieldAlias}: ${labelField}
                  ${idFieldAlias}: id
                  ${extraSelection}
                }
              }
            `
        setLastFetchMore({ extraSelection, list, skip, where })
        fetchMore({
          query: QUERY,
          variables: {
            where,
            take: subsequentItemsToLoad,
            skip,
          },
        })
          .then(() => {
            setLastFetchMore(null)
          })
          .catch(() => {
            setLastFetchMore(null)
          })
      }
    },
    { current: loadingIndicatorElement },
  )

  // TODO: better error UI
  // TODO: Handle permission errors
  // (ie; user has permission to read this relationship field, but
  // not the related list, or some items on the list)
  if (error) {
    return <span>Error</span>
  }

  if (state.kind === 'one') {
    return (
      <LoadingIndicatorContext.Provider value={loadingIndicatorContextVal}>
        <Select
          // this is necessary because react-select passes a second argument to onInputChange
          // and useState setters log a warning if a second argument is passed
          onInputChange={(val) => setSearch(val)}
          isLoading={loading || isLoading}
          autoFocus={autoFocus}
          components={relationshipSelectComponents}
          portalMenu={portalMenu}
          value={
            state.value
              ? {
                  value: state.value.id,
                  label: state.value.label,
                  // @ts-expect-error from KS code
                  data: state.value.data,
                }
              : null
          }
          options={options}
          onChange={(value) => {
            state.onChange(
              value
                ? {
                    id: value.value,
                    label: value.label,
                    data: (value as any).data,
                  }
                : null,
            )
          }}
          placeholder={placeholder}
          controlShouldRenderValue={controlShouldRenderValue}
          isClearable={controlShouldRenderValue}
          isDisabled={isDisabled}
        />
      </LoadingIndicatorContext.Provider>
    )
  }

  return (
    <LoadingIndicatorContext.Provider value={loadingIndicatorContextVal}>
      <MultiSelect // this is necessary because react-select passes a second argument to onInputChange
        // and useState setters log a warning if a second argument is passed
        onInputChange={(val) => setSearch(val)}
        isLoading={loading || isLoading}
        autoFocus={autoFocus}
        components={relationshipSelectComponents}
        portalMenu={portalMenu}
        value={state.value.map((value) => ({
          value: value.id,
          label: value.label,
          data: value.data,
        }))}
        options={options}
        onChange={(value) => {
          state.onChange(value.map((x) => ({ id: x.value, label: x.label, data: (x as any).data })))
        }}
        placeholder={placeholder}
        controlShouldRenderValue={controlShouldRenderValue}
        isClearable={controlShouldRenderValue}
        isDisabled={isDisabled}
      />
    </LoadingIndicatorContext.Provider>
  )
}

const relationshipSelectComponents: Partial<typeof selectComponents> = {
  MenuList: ({ children, ...props }) => {
    const { count, ref } = useContext(LoadingIndicatorContext)
    return (
      <selectComponents.MenuList {...props}>
        {children}
        <div css={{ textAlign: 'center' }} ref={ref}>
          {props.options.length < count && <span css={{ padding: 8 }}>Loading...</span>}
        </div>
      </selectComponents.MenuList>
    )
  },
}
