import * as AWS from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { createProduct } from '@functions/createProduct/handler';

const catalogBatchProcess = async (event: SQSEvent): Promise<void> => {
  console.log(event);

  const sns = new AWS.SNS();

  try {
    for (const record of event.Records) {
      const product = JSON.parse(record.body);
      await createProduct(product);

      await sns.publish({
        Subject: 'New product created',
        Message: JSON.stringify(product),
        TopicArn: process.env.SNS_ARN
      }).promise();
    }
  } catch(e) {
    return e;
  }
};

export const main = middyfy(catalogBatchProcess);
