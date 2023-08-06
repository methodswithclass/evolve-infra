export const response = (data) => {
  const { headers, ...rest } = data || {};
  const responseBody = {
    success: 'true',
    ...rest,
  };

  const respObj = {
    statusCode: 200,
    headers,
    body: JSON.stringify(responseBody),
  };

  return respObj;
};
