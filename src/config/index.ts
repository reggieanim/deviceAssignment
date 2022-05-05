import { equals } from 'rambda'

type AWSPARAMS = {
    endpoint: string;
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
}

type DynamoConfig = {
  seedingEnabled: boolean;
  auth: AWSPARAMS
  table: string;
}

type SnsConfig = {
  auth: AWSPARAMS
  topic: string;
  topicArn: string;
}

type S3Config = {
  s3ForcePathStyle: boolean;
  bucket: string;
  auth: AWSPARAMS
}

type SesConfig = {
  auth: AWSPARAMS
}
export interface Config {
  env: string;
  endpoint: string;
  debug: string;
  apiKey: string;
  version: string;
  dynamodb: DynamoConfig;
  s3: S3Config;
  sns: SnsConfig;
  ses: SesConfig;
}

// App configuration
export const config: Config = {
  env: process.env.ENV,
  endpoint: process.env.ENDPOINT,
  debug: process.env.DEBUG,
  apiKey: process.env.API_KEY,
  version: process.env.VERSION,
  dynamodb: {
    seedingEnabled: equals('true', process.env.DYNAMODB_SEEDING_ENABLED),
    auth: {
      endpoint: process.env.DYNAMODB_AUTH_ENDPOINT,
      accessKeyId: process.env.DYNAMODB_AUTH_ACCESS_KEY_ID,
      secretAccessKey: process.env.DYNAMODB_AUTH_SECRET_ACCESS_KEY,
      region: process.env.DYNAMODB_AUTH_REGION,
    },
    table: process.env.DYNAMODB_AUTH_TABLE
  },
  s3: {
    auth: {
      endpoint: process.env.S3_AUTH_ENDPOINT,
      accessKeyId: process.env.S3_AUTH_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_AUTH_SECRET_ACCESS_KEY,
      region: process.env.S3_AUTH_REGION
    },
    s3ForcePathStyle: equals('true', process.env.S3_FORCE_PATH_STYLE),
    bucket: process.env.S3_BUCKET_NAME
  },
  sns: {
    auth: {
      endpoint: process.env.SNS_AUTH_ENDPOINT,
      accessKeyId: process.env.SNS_AUTH_ACCESS_KEY_ID,
      secretAccessKey: process.env.SNS_AUTH_SECRET_ACCESS_KEY,
      region: process.env.SNS_AUTH_REGION
    },
    topic: process.env.SNS_TOPIC,
    topicArn: process.env.SNS_TOPIC_ARN
  },
  ses: {
    auth: {
      endpoint: process.env.SNS_AUTH_ENDPOINT,
      accessKeyId: process.env.SES_AUTH_ACCESS_KEY_ID,
      secretAccessKey: process.env.SES_AUTH_SECRET_ACCESS_KEY,
      region: process.env.SES_AUTH_REGION
    }
  }
}
