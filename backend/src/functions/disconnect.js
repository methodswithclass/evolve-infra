import { response } from '../utils/response-util';

const handler = async (event, context) => {
  console.log('debug event', event);
  try {
    return response();
  } catch (error) {
    console.error('error disconnecting', error.message);
    throw error;
  }
};

export { handler };
