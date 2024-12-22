// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractKeys<T> = T extends any ? keyof T : never

export type ExtractValues<T> = T extends { [x: string]: infer V } ? V : never

export type ExtractOptionValues<T> = T extends { [key: string]: { value: infer V } } ? V : never

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

export type Maybe<T> = T | null | undefined
