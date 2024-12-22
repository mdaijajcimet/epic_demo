import { nanoid } from 'nanoid'

export const addIdsToObjectArrays = (obj: any) => {
  const modifiedObj = { ...obj }

  for (const key in modifiedObj) {
    if (Array.isArray(modifiedObj[key])) {
      modifiedObj[key].forEach((element: any) => {
        if (typeof element === 'object') {
          const shouldAddId = !element?.id || element?.id === 'Do not edit this field'
          if (shouldAddId) element.id = nanoid()
          addIdsToObjectArrays(element)
        }
      })
    }
  }

  return modifiedObj
}
