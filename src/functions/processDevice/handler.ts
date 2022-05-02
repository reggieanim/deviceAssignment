import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { type AwilixContainer } from 'awilix'
import { formatJSONResponse } from '@libs/api-gateway';
import createDepContainer from '../../dependency'
import { middyfy } from '@libs/lambda';

import schema from './schema';

const processDevice: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const depContainer: AwilixContainer<any> = createDepContainer()
  const uploadToDynamo = depContainer.resolve('uploadToDynamo')
  uploadToDynamo(event)
  console.log(JSON.stringify(event))
  return formatJSONResponse({
    url: "signedUryeahl",
  });
};

export const main = middyfy(processDevice);
