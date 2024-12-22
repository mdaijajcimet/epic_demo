import { type Request, type Response } from 'express'
import { serverRequestFalcon } from '../libs/falconRequest'
import { BaseKeystoneTypeInfo, KeystoneContext } from '@keystone-6/core/types'
import { publishOEBillRulesQuery } from '../../admin/graphql/queries/falcon/publishOEBillRules'

export const publishOpenEnergyRules = async (
  req: Request,
  res: Response,
  commonContext: KeystoneContext<BaseKeystoneTypeInfo>,
) => {
  const context = await commonContext.withRequest(req, res)
  try {
    // Check for permissions of user to publish
    const user = context.session?.itemId

    if (!user) return res.status(401).json({ message: 'Unauthorized' })

    const userDetails = await context.prisma.user.findUnique({
      where: {
        id: user,
        roles: {
          some: {
            openEnergyBillRule: {
              array_contains: 'write',
            },
          },
        },
      },
    })

    if (!userDetails) throw new Error('You do not have permission to publish')

    // Prisma has default limit of 10,000 records per query
    const rules = await context.prisma.openEnergyBillRule.findMany({})

    const formatRules = rules.reduce((acc: Record<string, any>, item: any) => {
      const { transactionUType, value, isExclusive } = item
      if (!acc[transactionUType]) acc[transactionUType] = {}
      acc[transactionUType][value] = isExclusive
      return acc
    }, {} as Record<string, any>)

    const response = await serverRequestFalcon({
      query: publishOEBillRulesQuery,
      variables: {
        input: {
          rules: formatRules,
          publisher: userDetails.email,
        },
      },
    })
    if (response?.syncBillRules?.status)
      return res.status(200).json({
        status: true,
      })
    res.status(400).json({
      status: false,
      message: 'Something went wrong',
    })
  } catch (err: any) {
    console.error(err)
    res.status(400).send({ success: false, message: err.message || 'Something went wrong' })
  }
}
