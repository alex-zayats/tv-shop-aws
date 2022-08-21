import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import { middyfy } from '@libs/lambda';

const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  console.log(event);

  const authorizationToken = event.authorizationToken;
  const authCredentials = authorizationToken.replace('Basic ', '');
  const authCredentialsBuffer = Buffer.from(authCredentials, 'base64');
  const [userName, userPassword] = authCredentialsBuffer.toString('utf-8').split('=');

  console.log([userName, userPassword]);

  const accessLogin = process.env.USER_LOGIN;
  const accessPassword = process.env.USER_PASSWORD;

  if (userName === accessLogin && userPassword === accessPassword) {
    return createPolicy(userName, event.methodArn, 'Allow');
  } else {
    return createPolicy(userName, event.methodArn, 'Deny');
  }
};

const createPolicy = (principalId: string, resource: string, effect: string) => {
  return {
    "principalId": principalId,
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "execute-api:Invoke",
          "Effect": effect,
          "Resource": resource
        }
      ]
    }
  };
}

export const main = middyfy(basicAuthorizer);
