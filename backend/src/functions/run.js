import { response } from '../utils/response-util';
import getSendService from '../core/services/send-service';
import Evolve from '../core/evolve';
import getDBService from '../core/services/db-service';

const ACTION = 'run';

const run = ({ sendService, total }) => {
  let count = 0;

  return new Promise((resolve) => {
    let timer = setInterval(async () => {
      count++;
      if (count <= total) {
        console.log('debug send', count);
        await sendService.send({ count });
      } else {
        clearInterval(timer);
        timer = null;
        resolve(true);
      }
    }, 1000);
  });
};

const handler = async (event, context) => {
  console.log('debug event', event);

  try {
    const { total } = JSON.parse(event.body);
    const dbService = getDBService(event);
    const sendService = getSendService(ACTION, event);
    console.log('debug id', sendService.id);
    // await run({ sendService, total });
    const program = {
      totalGen: total,
      totalPop: 100,
      totalLength: 10,
      getGene: () => Math.floor(Math.random() * 100),
    };
    const evolve = new Evolve({ sendService, dbService, program });
    await dbService.update({ payload: { active: true } });
    await evolve.start();
    return response();
  } catch (error) {
    console.error('error running', error.message);
    throw error;
  }
};

export { handler };
