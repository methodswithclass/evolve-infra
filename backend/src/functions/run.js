import { response } from '../utils/response-util';
import getSendService from '../core/services/send-service';
import getDBService from '../core/services/db-service';
import Evolve from '../core/evolve';
import Feedback from '../core/programs/Feedback';
import Trash from '../core/programs/Trash';

const ACTION = 'run';

const handler = async (event, context) => {
  console.log('debug event', event);

  const programs = {
    feedback: Feedback,
    trash: Trash,
  };

  try {
    const { options } = JSON.parse(event.body);
    const { demo } = options;
    const dbService = getDBService(event);
    const sendService = getSendService(ACTION, event);
    const programDemo = programs[demo];
    const program = {
      ...options,
      ...programDemo,
    };
    const evolve = new Evolve({
      first: options?.first,
      best: options?.best,
      sendService,
      dbService,
      program,
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
