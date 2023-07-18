require("dotenv/config");
const DataRecord = require("../model/DataRecord");

const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
});

// const dynamoDB = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const DynamoDB = new AWS.DynamoDB();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

function createTable() {
  const params = {
    TableName: DataRecord,
    KeySchema: [{ AttributeName: "id", KeyType: "HASH" }],
    AttributeDefinitions: [{ AttributeName: "id", AttributeType: "S" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
  };

  DynamoDB.createTable(params, function (err, data) {
    if (err) {
      console.error("Unable to create table", err);
    } else {
      console.log("Created table", data);
    }
  });
}

module.exports = { dynamoDB, createTable };
