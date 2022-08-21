import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: {
          Ref: 'S3ImportBucket'
        },
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'uploaded/'
          }
        ],
        existing: true
      },
    },
  ],
  dependsOn: [
    'S3ImportBucket'
  ],
};
