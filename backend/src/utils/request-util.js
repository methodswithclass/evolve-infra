export const getEventParams = (event) => {
  const { domainName, stage } = event.requestContext;
  let { connectionId } = event.requestContext;
  let url;
  if (domainName && stage && connectionId) {
    url = `https://${domainName}/${stage}`;
  } else {
    const body = JSON.parse(event.body);
    url = body.url;
    connectionId = body.id;
  }

  return { url, id: connectionId };
};

export const getId = (data) => {
  const { sk } = data || {};

  const [, gen, ind] = sk?.split('#') || [];

  return { gen, ind };
};
