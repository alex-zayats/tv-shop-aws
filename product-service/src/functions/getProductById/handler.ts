import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';
import dbConnection from '@libs/db-connection';

const getProductById = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const client = new Client(dbConnection);
  await client.connect();

  try {
    const dbResponse = await client.query(`SELECT * from public.products WHERE id = '${event.pathParameters.id}'`);
    const product = dbResponse.rows.length > 0 ? dbResponse.rows[0] : {}; 

    return formatJSONResponse(product);
  } catch(e) {
    return e;
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductById);
