import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';
import dbConnection from '@libs/db-connection';


const getProductsList = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  console.log(event);

  const client = new Client(dbConnection);
  await client.connect();

  try {
    const dbResponse = await client.query('SELECT * from public.products inner join public.stocks on id = product_id'); 

    return formatJSONResponse(dbResponse.rows);
  } catch(e) {
    return e;
  } finally {
    client.end();
  }
};

export const main = middyfy(getProductsList);