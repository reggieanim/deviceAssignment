import { asValue, asFunction, createContainer } from 'awilix'
import { equals, prop, or } from 'rambda'
import { config, type Config  } from '../config'
import {createDynamoClient, createDynamoDocumentClient} from './util/client/dynamodb'
const [createIsProd, createIsDev, createIsWhatEnv] = [
  ({ config }: {config: Config}) => or(equals(prop('env', config), 'production'), equals(prop('env', config), 'prod')),
  ({ config }: {config: Config}) => or(equals(prop('env', config), 'development'), equals(prop('env', config), 'dev')),
  ({ config }: {config: Config}) => prop('env', config)
]

const container = createContainer()
container.register('config', asValue(config))
container.register('isProd', asFunction(createIsProd).scoped())
container.register('isDev', asFunction(createIsDev).scoped())
container.register('createIsWhatEnv', asFunction(createIsWhatEnv).scoped())
container.register('dynamoClient', asFunction(createDynamoClient).scoped())
container.register('dynamoDocumentClient', asFunction(createDynamoDocumentClient).scoped())

export default () => container