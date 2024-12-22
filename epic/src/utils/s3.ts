import {
  S3Client,
  CopyObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommandInput,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const PRE_SIGNED_URL_EXPIRY = 60 * 30

interface OperationArgs {
  bucket: string
  keyName: string
}

export const getS3Client = () =>
  new S3Client({
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    region: process.env.S3_REGION,
  })

export const copyMediaToS3 = async (filename: any, mimeType: string) => {
  const params: CopyObjectCommandInput = {
    Bucket: 'cimet-assets',
    Key: `media/${filename}`,
    CopySource: `cimet-assets/media/${filename}`,
    MetadataDirective: 'REPLACE',
    ContentType: mimeType,
  }
  const client = getS3Client()
  await client.send(new CopyObjectCommand(params))
}

export const uploadPreSignedUrl = async ({ bucket, keyName }: OperationArgs) => {
  if (!bucket) throw new Error('Bucket name not found')
  if (!keyName) throw new Error('Key not found')

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: keyName,
  })

  const client = getS3Client()
  return getSignedUrl(client, command, { expiresIn: PRE_SIGNED_URL_EXPIRY })
}

export const getPreSignedUrl = async ({ bucket, keyName }: OperationArgs) => {
  if (!bucket) throw new Error('Bucket name not found')
  if (!keyName) throw new Error('Key not found')

  const command = new GetObjectCommand({ Bucket: bucket, Key: keyName })
  const client = getS3Client()
  return getSignedUrl(client, command, { expiresIn: PRE_SIGNED_URL_EXPIRY })
}

export const deleteObject = async ({ bucket, keyName }: OperationArgs) => {
  if (!bucket) throw new Error('Bucket name not found')
  if (!keyName) throw new Error('Key not found')

  const command = new DeleteObjectCommand({ Bucket: bucket, Key: keyName })
  try {
    const client = getS3Client()
    await client.send(command)
  } catch (err) {
    console.error(err)
    throw err
  }
}
