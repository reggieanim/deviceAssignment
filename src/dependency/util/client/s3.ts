import { S3 } from 'aws-sdk'
import { type Config } from "../../../config";

export const createS3Client = ({
    config: {
        s3: {
            auth: {
                accessKeyId,
                secretAccessKey
            },
            s3ForcePathStyle,
        }
    }
}: { config: Config }): S3 => new S3({
    accessKeyId,
    secretAccessKey,
    s3ForcePathStyle,
})
