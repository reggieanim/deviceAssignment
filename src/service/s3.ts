import { type S3 } from 'aws-sdk'
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { always, cond, defaultTo, identity, when, prop, path } from 'rambda'
import { type Config } from '../config'
import createLogger from '../dependency/util/logger'

export type UrlBody = {
  Bucket?: string;
  Key: string;
  Expires?: number;
  Metadata: Metadata;
}

type Metadata = {
  filename: string;
  notification: any;
}

export enum UrlMethod {
  put = 'putObject',
  get = 'getObject'
}
// export const createPutToS3 = ({ s3Client, config }) => async (key, payload, { metadata = {} } = {}) => {
//   const { s3: { bucket: Bucket } } = config
//   const log = createLogger('S3:put')
//   const res = await s3Client.putObject({
//     Bucket: defaultTo(Bucket)('bucket'),
//     Key: key,
//     Body: cond([
//       [is(Buffer), identity],
//       [is(Object), toJson],
//       [T, identity]
//     ])(payload),
//     Metadata: when(isNilOrEmpty, always(null))(metadata)
//   }).promise()
//   log('Done putting to s3', res)
//   return { ...res, key }
// }

export const createGetFromS3 = ({ s3Client, config }: { s3Client: S3, config: Config }) => async (key: string) => {
  const { s3: { bucket: defaultBucket } } = config
  const log = createLogger('S3:get')
  log('Getting item from s3 using', key)
  const Bucket = defaultTo(defaultBucket)("bucket")
  return s3Client.getObject({ Bucket, Key: key }).promise()
}

export const createPresignedUrl = ({ s3Client, config }: { s3Client: S3, config: Config }) => async (method: UrlMethod , payload: UrlBody): Promise<string> => {
  const presignedURL: string = await s3Client.getSignedUrl(method, {
    Bucket: path(['s3', 'bucket'], config),
    Key: defaultTo('102startertaskset.json')(prop('Key', payload)), //filename
    Expires: defaultTo(100)(prop('Expires', payload)),
    ContentType: 'application/json'
  })
  console.log('config', config)
  console.log({
    Bucket: defaultTo(path(['s3', 'bucket'], config))(prop('Bucket', payload)),
    Key: defaultTo('default.json')(prop('Key', payload)), //filename
    Expires: defaultTo(100)(prop('Expires', payload)),
    ContentType: 'application/octet-stream',
    Conditions: [
      ['content-length-range', 0, 1000000],
    ],
  })

  return presignedURL
}
