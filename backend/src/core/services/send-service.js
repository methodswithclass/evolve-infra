import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import { getEventParams } from "../../utils/request-util";

const getSendService = (action, route, event) => {
  const defaultData = { action, route };

  const { url, id } = getEventParams(event);

  const api = new ApiGatewayManagementApiClient({ endpoint: url });

  const send = (data) => {
    const input = {
      ConnectionId: id,
      Data: JSON.stringify({ ...defaultData, ...data }),
    };

    const command = new PostToConnectionCommand(input);

    return api.send(command);
  };

  return {
    send,
    url,
    id,
  };
};

export default getSendService;
