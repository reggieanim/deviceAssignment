import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
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
  functions: { hello, uploadFile, processDevice },
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
