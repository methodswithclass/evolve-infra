import { response } from "../utils/response-util";
import { parseEvent } from "../utils/request-util";
import getSendService from "../core/services/send-service";
import getDBService from "../core/services/db-service";
import { run, step, create } from "../core/evolve/process";

const handler = async (event) => {
  console.log("debug event", event);

  try {
    const { action, route, params } = parseEvent(event);

    const dbService = getDBService(event);
    const sendService = getSendService(action, route, event);

    try {
      switch (route) {
        case "run":
          await run({ dbService, sendService, params });
          break;
        case "create":
          await create({ sendService, params });
          break;
        case "step":
          await step({ sendService, params });
          break;
        default:
          await dbService.update({ payload: { active: false } });
          break;
      }
    } catch (error) {
      console.error("debug error in evolve", error.message);
      await sendService.send({ message: error.message, final: true });
    }
    return response();
  } catch (error) {
    console.error("error running", error.message);
    throw error;
  }
};

export { handler };
