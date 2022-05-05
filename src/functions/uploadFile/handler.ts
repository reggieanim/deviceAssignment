import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse, formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { type AwilixContainer } from 'awilix'
import { type UrlBody, UrlMethod } from '../../service/s3'
import createDepContainer from '../../dependency'

import schema from './schema';

const uploadFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
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
  } catch (err) {
    return formatErrorResponse({
      error: 'An error occured'
    })
  }
};

export const main = middyfy(uploadFile);