import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { loadProductsList } from '@functions/products';

const getProductById = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  const products = await loadProductsList();
  const product = products.find(product => product.id == event.pathParameters.id) || {};

  return formatJSONResponse(product);
};

export const main = middyfy(getProductById);
