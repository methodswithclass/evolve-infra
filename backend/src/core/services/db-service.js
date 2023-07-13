import AWS from 'aws-sdk';
import { getEventParams } from '../../utils/request-util';

const batchSize = 25;

const getDBService = (event) => {
  const { ENV, NAME } = process.env;

  const TableName = `${ENV}-${NAME}-table`;
  const { id } = getEventParams(event);

  const db = new AWS.DynamoDB.DocumentClient();

  const getSK = (data) => {
    const { gen, ind } = data || {};
    const genKey = `${gen ? `#${gen}` : ''}`;
    const indKey = `${ind ? `#${ind}` : ''}`;
    return `item${genKey}${indKey}`;
  };

  const update = (data) => {
    const { payload = {} } = data || {};
    const params = Object.entries(payload).reduce((accum, [key, value]) => {
      return {
        ...accum,
        [key]: { Action: 'PUT', Value: value },
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

    return db.update(input).promise();
  };

  const list = (data) => {
    const input = {
      TableName,
      KeyConditions: {
        pk: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [id],
        },
        sk: {
          ComparisonOperator: 'BEGINS_WITH',
          AttributeValueList: [getSK(data)],
        },
      },
    };

    return db
      .query(input)
      .promise()
      .then((res) => {
        return res.Items;
      });
  };

  const get = (data) => {
    const input = {
      TableName,
      KeyConditions: {
        pk: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [id],
        },
        sk: {
          ComparisonOperator: 'EQ',
          AttributeValueList: [getSK(data)],
        },
      },
    };

    return db
      .query(input)
      .promise()
      .then((res) => {
        return res.Items[0];
      });
  };

  const deleteItems = async () => {
    const items = await list();

    const write = async (_items) => {
      const requests = _items.map((item) => {
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

      return db.batchWrite(params).promise();
    };

    let begin = 0;
    let remaining = false;

    do {
      remaining = items.length > begin + batchSize;
      await write(items.slice(begin, begin + batchSize));
      begin += batchSize;
    } while (remaining);

    return true;
  };

  return { update, list, get, deleteItems };
};

export default getDBService;
