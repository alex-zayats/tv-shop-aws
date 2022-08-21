import type { AWS } from '@serverless/typescript';
import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
        'Action': ['s3:ListBucket'],
        'Resource': {
          'Fn::GetAtt': [
            'S3ImportBucket',
            'Arn'
          ]
        }
      },
      {
        'Effect': 'Allow',
        'Action': ['s3:*'],
        'Resource': {
          "Fn::Join": [
            '',
            [
              {
                'Fn::GetAtt': [
                  'S3ImportBucket',
                  'Arn'
                ]
              },
              '/*'
            ]
          ]
        }
      },
      {
        'Effect': 'Allow',
        'Action': ['sqs:*'],
        'Resource': {
          'Fn::ImportValue': 'catalogItemsQueueARN'
        }
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      IMPORT_S3_BUCKET: {
        Ref: 'S3ImportBucket'
      },
      SQS_URL: {
        'Fn::ImportValue': 'catalogItemsQueueURL'
      },
      AUTHORIZER_ARN: {
        'Fn::ImportValue': 'basicAuthorizerARN'
      }
    },
  },
  resources: {
    Resources: {
      S3ImportBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'import-product-bucket'
        }
      }
    }
  },
  functions: {
    importProductsFile,
    importFileParser
  },
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
