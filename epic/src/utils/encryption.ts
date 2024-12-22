import crypto from 'crypto'
import { GraphQLError } from 'graphql'

export const encryptError = new GraphQLError('Error Occurred while encrypting', {
  extensions: { code: 'ENCRYPTION_ERROR' },
})

export const decryptError = new GraphQLError('Error Occurred while decrypting', {
  extensions: { code: 'DECRYPTION_ERROR' },
})

export const hash = (data: string) => (data ? crypto.createHash('sha256').update(data).digest('hex') : null)

const getSecrets = () => {
  const secret = process.env.GDPR_SECRET_KEY ?? process.env.NEXT_PUBLIC_GDPR_SECRET_KEY ?? ''
  const secretIv = process.env.GDPR_SECRET_IV ?? process.env.NEXT_PUBLIC_GDPR_SECRET_IV ?? ''
  const secretHashIv16 = secretIv ? hash(secretIv)?.slice(0, 16) ?? '' : ''
  const secretHash32 = secret ? hash(secret)?.slice(0, 32) ?? '' : ''
  return [secretHash32, secretHashIv16]
}

export function encrypt(data: string) {
  try {
    if (!data) return
    const [secretHash32, secretHashIv16] = getSecrets()
    const cipher = crypto.createCipheriv('AES-256-CBC', secretHash32, secretHashIv16)
    let encrypted = cipher.update(data, 'utf8', 'base64') // 1st Base64 encoding
    encrypted += cipher.final('base64')
    return Buffer.from(encrypted, 'utf8').toString('base64')
  } catch (err) {
    console.error(`[function]: encrypt [input] :[${data}] from: catch [${err}]`)
    throw encryptError
  }
}

export function decrypt(valtoDecrypt: string) {
  const [secretHash32, secretHashIv16] = getSecrets()

  try {
    if (!valtoDecrypt) return
    const toDecrypt = Buffer.from(valtoDecrypt, 'base64').toString('utf8') // 1st Base64 decoding
    const decipher = crypto.createDecipheriv('aes-256-cbc', secretHash32, secretHashIv16)
    const decrypted = decipher.update(toDecrypt, 'base64', 'utf8') // 2nd Base64 decoding
    return decrypted + decipher.final('utf8')
  } catch (err) {
    console.error(`[function]: decrypt [input] :[${valtoDecrypt}] from: catch [${err}]`)
    throw decryptError
  }
}
