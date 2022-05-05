import { SES } from 'aws-sdk'
import { type Config } from "../../../config";

export const createSESClient = ({
    config: {
        sns: {
            auth: {
                accessKeyId,
                secretAccessKey,
                region
            }
        }
    }
}: { config: Config }): SES => new SES({
    accessKeyId,
    secretAccessKey,
    region
})
