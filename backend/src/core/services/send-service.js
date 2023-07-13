import AWS from 'aws-sdk';
import { getEventParams } from '../../utils/request-util';

const getSendService = (action, event) => {
  const defaultData = { action };

  const { url, id } = getEventParams(event);

  const api = new AWS.ApiGatewayManagementApi({ endpoint: url });

  const send = (data) => {
    return api
      .postToConnection({
        ConnectionId: id,
        Data: JSON.stringify({ ...defaultData, ...data }),
      })
      .promise();
  };

  return {
    send,
    url,
    id,
  };
};

export default getSendService;
