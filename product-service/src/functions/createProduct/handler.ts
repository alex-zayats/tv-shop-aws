import { APIGatewayEvent } from 'aws-lambda';
import { middyfy } from '@libs/lambda';
import { Client } from 'pg';
import dbConnection from '@libs/db-connection';

const createProduct = async (event: APIGatewayEvent): Promise<void> => {
  console.log(event);

  const client = new Client(dbConnection);
  await client.connect();
  const { title, description, price } = event as any;

  try {
    await client.query(`INSERT INTO public.products (title, description, price) VALUES ('${title}', '${description}', ${price})`);
  } catch(e) {
    return e;
  } finally {
    client.end();
  }
};

export const main = middyfy(createProduct);
