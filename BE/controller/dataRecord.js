const { dynamoDB } = require("../config/db");
const DataRecord = require("../model/DataRecord");
const { v4: uuidv4 } = require("uuid");

async function insertBatchDataRecord(req, res, next) {
  const io = req.app.get("io");
  const records = req.body;

  const newRecords = records.map((record) => ({
    id: uuidv4(),
    ...record,
  }));

  try {
    const putRequests = newRecords.map((record) => ({
      PutRequest: {
        Item: record,
      },
    }));

    const params = {
      RequestItems: {
        [DataRecord]: putRequests,
      },
    };
    await dynamoDB.batchWrite(params).promise();
    io.emit("sync", newRecords);
    return res.status(200).json(newRecords);
  } catch (error) {
    next(error);
  }
}

async function retrieveDataRecords(req, res, next) {
  try {
    const params = {
      TableName: DataRecord,
    };

    const { Items } = await dynamoDB.scan(params).promise();

    return res.status(200).send(Items);
  } catch (error) {
    next(error);
  }
}

async function updateDataRecord(req, res, next) {
  const io = req.app.get("io");
  try {
    const record = req.body;
    const recordId = req.params.id;

    let updateExpression = "set";
    let ExpressionAttributeNames = {};
    let ExpressionAttributeValues = {};
    for (const property in record) {
      updateExpression += ` #${property} = :${property} ,`;
      ExpressionAttributeNames["#" + property] = property;
      ExpressionAttributeValues[":" + property] = record[property];
    }

    updateExpression = updateExpression.slice(0, -1);

    const params = {
      TableName: DataRecord,
      Key: { id: recordId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: ExpressionAttributeNames,
      ExpressionAttributeValues: ExpressionAttributeValues,
    };

    await dynamoDB.update(params).promise();

    const updatedRecord = {
      id: recordId,
      ...record,
    };

    io.emit("update", updatedRecord);
    res.json(record);
  } catch (error) {
    next(error);
  }
}

async function deleteDataRecord(req, res, next) {
  const io = req.app.get("io");
  try {
    const recordId = req.params.id;

    const params = {
      TableName: DataRecord,
      Key: { id: recordId },
    };

    await dynamoDB.delete(params).promise();

    io.emit("delete", recordId);
    return res.json(recordId);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  retrieveDataRecords,
  insertBatchDataRecord,
  updateDataRecord,
  deleteDataRecord,
};
