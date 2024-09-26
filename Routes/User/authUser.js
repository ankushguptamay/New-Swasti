const express = require("express");
const {
  registerByEmail,
  loginByEmail,
  verifyEmailOTP,
  registerByNumber,
  loginByNumber,
  verifyNumberOTP,
} = require("../../Controller/User/userController");

const user = express.Router();

// BIO
user.post("/registerByEmail", registerByEmail);
user.post("/loginByEmail", loginByEmail);
user.post("/verifyEmailOTP", verifyEmailOTP);
user.post("/registerByNumber", registerByNumber);
user.post("/loginByNumber", loginByNumber);
user.post("/verifyNumberOTP", verifyNumberOTP);

module.exports = user;
