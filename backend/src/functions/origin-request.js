const handler = async (event, context, callback) => {
  console.log('debug event', event);
  try {
    const request = event.Records[0].cf.request;
    if (!request.uri.slice(-5).includes('.')) {
      request.uri = '/index.html';
    }
    callback(null, request);
  } catch (error) {
    console.error('error connecting', error.message);
    throw error;
  }
};

export { handler };
