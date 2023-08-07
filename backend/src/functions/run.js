import { response } from '../utils/response-util';
import getSendService from '../core/services/send-service';
import getDBService from '../core/services/db-service';
import Evolve from '../core/evolve';
import getFeedback from '../core/programs/Feedback';
import getTrash from '../core/programs/Trash';

const ACTION = 'run';

const handler = async (event, context) => {
  console.log('debug event', event);

  try {
    const { options } = JSON.parse(event.body);
    const { demo } = options;
    const dbService = getDBService(event);
    const sendService = getSendService(ACTION, event);
    const program = demo === 'trash' ? getTrash(options) : getFeedback(options);
    const evolve = new Evolve({
      options,
      program,
      sendService,
      dbService,
    });
    await dbService.update({ payload: { active: true } });
    await evolve.start();
    return response();
  } catch (error) {
    console.error('error running', error.message);
    throw error;
  }
};

export { handler };
