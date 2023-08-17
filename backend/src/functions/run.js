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
    const { params } = JSON.parse(event.body);
    const { demo } = params;
    const dbService = getDBService(event);
    const sendService = getSendService(ACTION, event);
    const program =
      demo === 'trash'
        ? getTrash(params)
        : getFeedback(params);
    try {
      const evolve = Evolve({
        ...params,
        beforeEach: async () => {
          const { active } = await dbService.get();

          return active;
        },
        afterEach: async (input) => {
          await sendService.send(input);
        },
        onEnd: async (input) => {
          await sendService.send({ ...input, final: true });
        },
        ...program,
      });
      await dbService.update({ payload: { active: true } });
      await evolve.start();
    } catch (error) {
      console.error('debug error in evolve', error.message);
      await sendService.send({ message: error.message, final: true });
    }
    return response();
  } catch (error) {
    console.error('error running', error.message);
    throw error;
  }
};

export { handler };
