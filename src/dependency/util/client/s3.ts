import { S3 } from 'aws-sdk'
import createLogger from '../logger'
import { always, cond, defaultTo, identity, when, or, isNil, isEmpty } from 'rambda'
import { type Config } from "../../../config";

let checkIfisBuffer: (payload: any) => boolean = function (payload) {
  return Buffer.isBuffer(payload)
}


export const createS3Client = ({
    config: {
        s3: {
            auth: {
                endpoint,
                accessKeyId,
                secretAccessKey
            },
            s3ForcePathStyle,
            ...options
        }
    }
}: { config: Config }) => new S3({
    endpoint,
    accessKeyId,
    secretAccessKey,
    s3ForcePathStyle,
    ...options
})

export const createPutToS3 = ({ s3Client, config }: { s3Client: S3, config: Config }) => async (key: string, payload, { bucket = 'defaultBucket', metadata = {} } = {}) => {
    const { s3: { bucket: Bucket } } = config
    const log = createLogger('S3:put')
    const res = await s3Client.putObject({
      Bucket: defaultTo(Bucket)(bucket),
      Key: key,
      Body: cond([
       [checkIfisBuffer, identity]
      ])(payload),
      Metadata: when(or(isNil, isEmpty), always(null))(metadata)
    }).promise()
    log('Done putting to s3', res)
    return { ...res, key }
  }
  
  export const createGetFromS3 = ({ s3Client, config }: { s3Client: S3, config: Config }) => async (key: string) => {
    const { s3: { bucket: defaultBucket } } = config
    const log = createLogger('S3:get')
    log('Getting item from s3 using', key)
    const Bucket = defaultTo(defaultBucket)("bucket")
    return s3Client.getObject({ Bucket, Key: key }).promise()
  }