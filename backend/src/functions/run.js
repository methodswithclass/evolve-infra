import { response } from '../utils/response-util';
import getSendService from '../core/services/send-service';

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
    const sendService = getSendService(ACTION, event);
    await run({ sendService, total });
    return response();
  } catch (error) {
    console.error('error running', error.message);
    throw error;
  }
};

export { handler };
