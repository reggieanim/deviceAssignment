import { S3 } from 'aws-sdk'
import { type Config } from "../../../config";

export const createS3Client = ({
    config: {
        s3: {
            auth: {
                // endpoint,
                accessKeyId,
                secretAccessKey
            },
            s3ForcePathStyle,
            ...options
        }
    }
}: { config: Config }) => new S3({
    signatureVersion: 'v4',
    accessKeyId,
    secretAccessKey,
    s3ForcePathStyle,
    ...options
})
