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

export const parseEvent = (event) => {
  try {
    return JSON.parse(event.body);
  } catch (error) {
    console.log(`debug error ${JSON.stringify(error)}`);
    throw error;
  }
};

export const getId = (data) => {
  const { sk } = data || {};

  const [, gen, ind] = sk?.split("#") || [];

  return { gen: gen.split(":")?.[1], ind: ind.split(":")?.[1] };
};
