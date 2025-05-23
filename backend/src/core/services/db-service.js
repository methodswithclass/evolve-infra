import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { splitEvery } from "ramda";
import { getEventParams } from "../../utils/request-util";

const batchSize = 25;

const getDBService = (event) => {
  const { env, appName } = process.env;

  const TableName = `${env}-${appName}-table`;
  const { id } = getEventParams(event);

  const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient());

  const getSK = (data) => {
    const { gen, ind } = data || {};
    const genKey = `${gen ? `#gen:${gen}` : ""}`;
    const indKey = `${ind ? `#ind:${ind}` : ""}`;
    return `item${genKey}${indKey}`;
  };

  const update = async (data) => {
    const { payload = {} } = data || {};
    const params = Object.entries(payload).reduce((accum, [key, value]) => {
      return {
        ...accum,
        [key]: { Action: "PUT", Value: value },
      };
    }, {});

    const input = {
      TableName,
      Key: {
        pk: id,
        sk: getSK(data),
      },
      AttributeUpdates: params,
    };

    const command = new UpdateCommand(input);

    return dbClient.send(command);
  };

  const list = async (data) => {
    const input = {
      TableName,
      KeyConditions: {
        pk: {
          ComparisonOperator: "EQ",
          AttributeValueList: [id],
        },
        sk: {
          ComparisonOperator: "BEGINS_WITH",
          AttributeValueList: [getSK(data)],
        },
      },
    };

    const command = new QueryCommand(input);

    return dbClient.send(command).then((res) => res.Items);
  };

  const get = async (data) => {
    const items = await list(data);
    return items[0];
  };

  const deleteItems = async () => {
    const items = await list();

    const batches = splitEvery(batchSize, items);

    const promises = batches.map(async (batch) => {
      const requests = batch.map((item) => {
        const { pk, sk } = item;
        return {
          DeleteRequest: {
            Key: {
              pk,
              sk,
            },
          },
        };
      });

      const params = {
        RequestItems: {
          [TableName]: requests,
        },
      };

      const command = new BatchWriteCommand(params);

      return dbClient.send(command);
    });

    await Promise.all(promises);

    return true;
  };

  return { update, list, get, deleteItems };
};

export default getDBService;
