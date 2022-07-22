import { APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { loadProductsList } from '@functions/products';


const getProductsList = async (_event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
  return formatJSONResponse(await loadProductsList());
};

export const main = middyfy(getProductsList);
