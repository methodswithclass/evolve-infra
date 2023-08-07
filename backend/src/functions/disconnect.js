import { response } from '../utils/response-util';
import getDBService from '../core/services/db-service';

const handler = async (event, context) => {
  console.log('debug event', event);
  try {
    const dbService = getDBService(event);
    await dbService.deleteItems();
    return response();
  } catch (error) {
    console.error('error disconnecting', error.message);
    throw error;
  }
};

export { handler };
