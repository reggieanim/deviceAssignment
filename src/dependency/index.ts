import { asValue, asFunction, createContainer, AwilixContainer } from 'awilix'
import { equals, prop, or } from 'rambda'

// conig
import { config, type Config } from '../config'

// client
import { createDynamoClient, createDynamoDocumentClient } from './util/client/dynamodb'
import { createS3Client } from './util/client/s3'
import { createSNSClient } from './util/client/sns'
import { createSESClient } from './util/client/ses'

// services
import { createPresignedUrl, createGetFromS3 } from 'src/service/s3'
import { createSendEmail, createSubscriber } from 'src/service/sns'
import { createAWSStorageClient } from 'src/service/dynamo'
import { createSendEmail as sesSendEmail } from 'src/service/ses'

// crud
import uploadToDynamo from '../crud/uploadToDynamo'
const [createIsProd, createIsDev, createIsWhatEnv] = [
  ({ config }: { config: Config }): boolean => or(equals(prop('env', config), 'production'), equals(prop('env', config), 'prod')),
  ({ config }: { config: Config }): boolean  => or(equals(prop('env', config), 'development'), equals(prop('env', config), 'dev')),
  ({ config }: { config: Config }): string => prop('env', config)
]

const container: AwilixContainer<any> = createContainer()
container.register('config', asValue(config))
container.register('isProd', asFunction(createIsProd).scoped())
container.register('isDev', asFunction(createIsDev).scoped())
container.register('createIsWhatEnv', asFunction(createIsWhatEnv).scoped())
container.register('dynamoClient', asFunction(createDynamoClient).scoped())
container.register('dynamoDocumentClient', asFunction(createDynamoDocumentClient).scoped())
container.register('s3Client', asFunction(createS3Client).scoped())
container.register('snsClient', asFunction(createSNSClient).scoped())
container.register('sesClient', asFunction(createSESClient).scoped())
container.register('getFromS3', asFunction(createGetFromS3).scoped())
container.register('createPresignedUrl', asFunction(createPresignedUrl).scoped())
container.register('uploadToDynamo', asFunction(uploadToDynamo).scoped())
container.register('createAWSStorageClient', asFunction(createAWSStorageClient).scoped())
container.register('createSendEmail', asFunction(createSendEmail).scoped())
container.register('createSendSesEmail', asFunction(sesSendEmail).scoped())
container.register('createSubscriber', asFunction(createSubscriber).scoped())

export default (): AwilixContainer<any> => container