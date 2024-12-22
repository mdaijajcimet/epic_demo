import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)
dayjs.extend(isSameOrAfter)
dayjs.extend(customParseFormat)
dayjs.tz.setDefault('Australia/Sydney')

export const utcToAest = (date: string) => dayjs(date).tz('Australia/Sydney').format('DD/MM/YYYY HH:mm:ss')
