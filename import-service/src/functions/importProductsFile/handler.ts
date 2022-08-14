import * as AWS from 'aws-sdk';
import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

const importProductsFile = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const s3 = new AWS.S3({ region: 'eu-west-1' });
  const { name } = event.queryStringParameters;
  const command = {
    Bucket: process.env.IMPORT_S3_BUCKET,
    Key: `uploaded/${name}`,
    ContentType: 'text/csv',
    Expires: 3600
  };

  const signedUrl = s3.getSignedUrl('putObject', command);

  return formatJSONResponse(signedUrl);
};

export const main = middyfy(importProductsFile);
