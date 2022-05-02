import { SNS } from 'aws-sdk'
import { type Config } from "../../../config";

export const createSNSClient = ({
    config: {
        sns: {
            auth: {
                accessKeyId,
                secretAccessKey,
                region
            }
        }
    }
}: { config: Config }): SNS => new SNS({
    credentials: {
        accessKeyId,
        secretAccessKey
    },
    region
})
