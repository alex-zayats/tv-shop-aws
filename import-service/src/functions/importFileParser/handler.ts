import * as AWS from 'aws-sdk';
import { S3Event, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const csv = require('csv-parser');

const importFileParser = async (event: S3Event): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const s3 = new AWS.S3({ region: 'eu-west-1' });

  for (const record of event.Records) {
    const objectKey = record.s3.object.key;
    const bucketName = record.s3.bucket.name;

    await new Promise((resolve, reject) => {
      s3.getObject({
          Bucket: process.env.IMPORT_S3_BUCKET,
          Key: objectKey
        })
        .createReadStream()
        .pipe(csv())
        .on('data', () => {})
        .on('end', async () => {
          await s3.copyObject({ Bucket: bucketName, Key: objectKey.replace('uploaded', 'parsed'), CopySource: bucketName + '/' + objectKey }).promise();
          await s3.deleteObject({ Bucket: bucketName, Key: objectKey }).promise();

          resolve(true);
        })
        .on('error', (error) => {
          console.log(error);
          reject(false);
        });
    });
  }

  return formatJSONResponse(true);
};

export const main = middyfy(importFileParser);
