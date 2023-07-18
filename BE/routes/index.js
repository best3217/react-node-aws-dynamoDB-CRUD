const express = require("express");
const dataRouter = require("./api/dataRecord");

const router = express.Router();

router.use("/datarecord", dataRouter);

module.exports = router;
