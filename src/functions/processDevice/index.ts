// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        batchSize: 10,
        arn: {
          "Fn::GetAtt": ['TestQueue', 'Arn']
        }
      },
    },
  ],
};
