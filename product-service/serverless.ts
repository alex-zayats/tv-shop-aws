import type { AWS } from '@serverless/typescript';
import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        'Effect': 'Allow',
        'Action': ['sns:*'],
        'Resource': {
          Ref: 'createProductTopic'
        }
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SNS_ARN: {
        Ref: 'createProductTopic'
      },
      SQS_ARN: {
        Ref: 'catalogItemsQueue'
      }
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      createProductTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'createProductTopic'
        }
      },
      SNSSubscription: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'only_alex_zayats@outlook.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic'
          }
        }
      }
    },
    Outputs: {
      exportCatalogItemsQueueARN: {
        Description: '',
        Value: {
          'Fn::GetAtt': [
            'catalogItemsQueue',
            'Arn'
          ]
        },
        Export: {
          Name: 'catalogItemsQueueARN'
        }
      },
      exportCatalogItemsQueueURL: {
        Description: '',
        Value: {
          Ref: 'catalogItemsQueue'
        },
        Export: {
          Name: 'catalogItemsQueueURL'
        }
      }
    }
  },
  functions: {
    getProductsList,
    getProductById,
    createProduct,
    catalogBatchProcess
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk', 'pg-native'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
