export type ValueType = 'currency' | 'percent'

export type ValidateRangeValuesOpt = { type?: ValueType; typeField?: string }

export type ValidatePercentOpt = { validateAlways?: boolean; typeField?: string }
