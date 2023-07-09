import AWS from 'aws-sdk';

const getSendService = (action, event) => {
  const getSendUrl = () => {
    const { domainName, stage } = event.requestContext;
    let { connectionId } = event.requestContext;
    let url;
    if (domainName && stage && connectionId) {
      url = `https://${domainName}/${stage}`;
    } else {
      const body = JSON.parse(event.body);
      url = body.url;
      connectionId = body.id;
    }

    return { url, id: connectionId };
  };

  const defaultData = { action };

  const { url, id } = getSendUrl();

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
