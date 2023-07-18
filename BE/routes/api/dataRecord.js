const express = require("express");
const {
  insertBatchDataRecord,
  retrieveDataRecords,
  deleteDataRecord,
  updateDataRecord,
} = require("../../controller/dataRecord");

const dataRouter = express.Router();

dataRouter.route("/").post(insertBatchDataRecord).get(retrieveDataRecords);

dataRouter.route("/:id").delete(deleteDataRecord).patch(updateDataRecord);

module.exports = dataRouter;
