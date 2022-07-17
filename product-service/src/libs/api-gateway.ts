export const formatJSONResponse = (response: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify(response),
    headers: {
      "Access-Control-Allow-Headers" : "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    },
  }
}
