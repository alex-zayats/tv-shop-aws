import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { Client } from 'pg';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import dbConnection from '@libs/db-connection';


const getProductsList = async (_event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const client = new Client(dbConnection);

  await client.connect();

  try {
    const dbResponse = await client.query('select * from public.products inner join public.stocks on id = product_id'); 

    return formatJSONResponse(dbResponse.rows);
  } catch {
    return null;
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductsList);