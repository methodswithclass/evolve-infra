import getDBService from '../core/services/db-service';
import { response } from '../utils/response-util';

const handler = async (event, context) => {
  console.log('debug event', event);
  try {
    const dbService = getDBService(event);
    await dbService.update({ payload: { active: true } });
    return response();
  } catch (error) {
    console.error('error connecting', error.message);
    throw error;
  }
};

export { handler };
