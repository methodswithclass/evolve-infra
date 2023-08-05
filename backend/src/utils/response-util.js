export const response = (data) => {
  const { headers, ...rest } = data || {};
  const responseBody = {
    success: 'true',
    data: rest,
  };

  const respObj = {
    statusCode: 200,
    headers,
    body: JSON.stringify(responseBody),
  };

  return respObj;
};
