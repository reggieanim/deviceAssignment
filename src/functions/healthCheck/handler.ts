import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { type AwilixContainer } from 'awilix'
import { formatJSONResponse } from '@libs/api-gateway';
import createDepContainer from '../../dependency'
import { middyfy } from '@libs/lambda';

import schema from './schema';

enum Stage {
  development = 'dev',
  production = 'prod',
  staging = 'staging'
}

const healthCheck: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const depContainer: AwilixContainer<any> = createDepContainer()
  const config = depContainer.resolve('config')
  const version: string = config.version
  const stage: Stage = config.env
  const status: string = "available"

  return formatJSONResponse({
    message: {
      version,
      stage,
      status
    },
  });
};

export const main = middyfy(healthCheck);
