import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { type SNS } from 'aws-sdk'
import { formatJSONResponse, formatErrorResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { type AwilixContainer } from 'awilix'
import { type Config } from '../../config'
import { type UrlBody, UrlMethod } from '../../service/s3'
import createDepContainer from '../../dependency'

import schema from './schema';

const uploadFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const depContainer: AwilixContainer<any> = createDepContainer()
    const getSignedUrl: (method: UrlMethod, payload: UrlBody) => Promise<string> = depContainer.resolve('createPresignedUrl')
    const createSubscriber: (params: SNS.Types.SubscribeInput) => Promise<SNS.SubscribeResponse> = depContainer.resolve('createSubscriber')
    const config: Config = depContainer.resolve('config')
    const body: UrlBody = {
      Key: event.body.filename,
      Metadata: {
        filename: event.body.filename,
        notification: event.body.notification
      }
    }
    const signedUrl: string = await getSignedUrl(UrlMethod.put, body)
    const params: SNS.Types.SubscribeInput = {
      Protocol: 'email',
      TopicArn: config.sns.topicArn,
      Endpoint: event.body.notification
    }
    await createSubscriber(params)
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
