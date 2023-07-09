export const response = (data) => {
  const responseBody = {
    success: 'true',
    data,
  };

  const respObj = {
    statusCode: 200,
    body: JSON.stringify(responseBody),
  };

  return respObj;
};
