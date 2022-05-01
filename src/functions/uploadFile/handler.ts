import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { type AwilixContainer } from 'awilix'
import { type UrlBody, UrlMethod } from '../../service/s3'
import { formatJSONResponse } from '@libs/api-gateway';
import createDepContainer from '../../dependency'
import { middyfy } from '@libs/lambda';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const depContainer: AwilixContainer<any> = createDepContainer()
  const getSignedUrl: (method: UrlMethod, payload: UrlBody) => Promise<string> = depContainer.resolve('createPresignedUrl')
  const body: UrlBody = {
    Key: event.body.filename,
    Metadata: {
      filename: event.body.filename,
      notification: event.body.notification
    }
  }
  const signedUrl: string = await getSignedUrl(UrlMethod.put, body)

  return formatJSONResponse({
    url: signedUrl,
  });
};

export const main = middyfy(hello);
