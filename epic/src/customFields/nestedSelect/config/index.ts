/* eslint-disable @typescript-eslint/no-explicit-any */
import { GET_SUBAFFILIATES } from '../../../../admin/graphql/queries/Common'

export const relationshipConfig: any = {
  affiliate: {
    query: GET_SUBAFFILIATES,
    variables: (data: string) => ({
      where: {
        affiliateId: data,
      },
    }),
    dataProcessor: (results: any) => {
      const updatedData = results?.reduce((acc: any, { data }: any) => {
        let updatedData = []
        let affiliateName: string | null
        if (data && data.affiliate && data.affiliate.subAffiliates) {
          affiliateName = data.affiliate.name || null
          updatedData = data.affiliate.subAffiliates
        }
        updatedData = updatedData.map((item: any) =>
          affiliateName && item.name ? { ...item, name: `${affiliateName}: ${item.name}` } : item,
        )
        return [...acc, ...updatedData]
      }, [])
      return updatedData
    },
  },
}
