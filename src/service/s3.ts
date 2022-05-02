import { type S3 } from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import { defaultTo, prop, path } from 'rambda'
import { type Config } from '../config'
import createLogger from '../dependency/util/logger'

export type UrlBody = {
  Bucket?: string;
  Key: string;
  Expires?: number;
  Metadata?: Metadata;
}

type Metadata = {
  filename: string;
  notification: any;
}

export enum UrlMethod {
  put = 'putObject',
  get = 'getObject'
}


export const createGetFromS3 = ({ s3Client, config }: { s3Client: S3, config: Config }) => async (key: string): Promise<S3.GetObjectOutput> => {
  const { s3: { bucket: Bucket } } = config
  const log = createLogger('S3:get')
  log('Getting item from s3 using', key)
  return s3Client.getObject({ Bucket, Key: key }).promise()
}

export const createPresignedUrl = ({ s3Client, config }: { s3Client: S3, config: Config }) => async (method: UrlMethod, payload: UrlBody): Promise<string> => {
  const filename = prop('Key', payload)
  const id: string = uuidv4()
  const presignedURL: string = await s3Client.getSignedUrl(method, {
    Bucket: path(['s3', 'bucket'], config),
    Key: `${filename}_${id}.json`, //filename
    Expires: defaultTo(100)(prop('Expires', payload)),
    ContentType: 'application/json',
    Metadata: payload.Metadata
  })

  return presignedURL
}
