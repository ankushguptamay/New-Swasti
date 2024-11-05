const express = require("express");
const {
  addUpdateVersion,
  getVersion,
} = require("../Controller/Admin/versionController");

const version = express.Router();

version.post("/version", addUpdateVersion);
version.get("/version", getVersion);

module.exports = version;
