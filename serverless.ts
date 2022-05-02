import type { AWS } from '@serverless/typescript';

import healthCheck from '@functions/healthCheck';
import uploadFile from '@functions/uploadFile';
import processDevice from '@functions/processDevice';

const serverlessConfiguration: AWS = {
  service: 'deviceassignment',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dotenv-plugin', 'serverless-s3-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  resources: {
    Resources: {
      uploadProgressNotificationTopic: {
        Type: 'AWS::SNS::Topic',
        Properties:
        {
          DisplayName: "The notification topic for upload progress",
          TopicName: 'sendPEmail'
        }
      },
      emailToSNSUploadProgressNotificationTopicSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties:
        {
          Endpoint: "animreggie@gmail.com",
          Protocol: "email",
          TopicArn: { Ref: "uploadProgressNotificationTopic" }
        }
      },
      TestBucket: {
        Type: 'AWS::S3::Bucket',
        DependsOn: ['TestQueue', 'QueuePolicy'],
        Properties: {
          BucketName: 'device-data-assignmentv477',
          NotificationConfiguration: {
            QueueConfigurations: [{ Event: 's3:ObjectCreated:*', Queue: { "Fn::GetAtt": ['TestQueue', 'Arn'] } }]
          }
        }
      },
      devicesTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "devicesTable277",
          AttributeDefinitions: [
            {
              AttributeName: "deviceId",
              AttributeType: "S",
            },
            {
              AttributeName: "deviceName",
              AttributeType: "S",
            }
          ],
          KeySchema: [
            {
              AttributeName: "deviceId",
              KeyType: "HASH",
            },
            {
              AttributeName: "deviceName",
              KeyType: "RANGE",
            }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        }
      },
      QueuePolicy: {
        Type: "AWS::SQS::QueuePolicy",
        DependsOn: ['TestQueue'],
        Properties: {
          Queues: [{ Ref: "TestQueue" }],
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: "*",
                Action: [
                  "sqs:SendMessage"
                ],
                Resource: {
                  "Fn::GetAtt": ['TestQueue', 'Arn']
                },
                Condition: {
                  ArnLike: {
                    'aws:SourceArn': {
                      "Fn::Join": ["", ['arn:aws:s3:::', 'device-data-assignmentv477']]
                    }
                  }
                }
              }
            ]
          }
        }
      },
      TestQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          VisibilityTimeout: 180,
          MessageRetentionPeriod: 1209600,
          QueueName: 'devices-queue6788'
        }
      }
    }
  },
  // import the function via paths
  functions: { healthCheck, uploadFile, processDevice },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
