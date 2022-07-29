import type { AWS } from '@serverless/typescript';
import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const { IMPORT_S3_BUCKET } = process.env;

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        'Effect': 'Allow',
        'Action': 's3:ListBucket',
        'Resource': [
            `arn:aws:s3:::${IMPORT_S3_BUCKET}`
        ]
      },
      {
        'Effect': 'Allow',
        'Action': [
            's3:*'
        ],
        'Resource': [
            `arn:aws:s3:::${IMPORT_S3_BUCKET}/*`
        ]
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
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
