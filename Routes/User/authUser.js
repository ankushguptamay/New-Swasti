const express = require("express");
const {
  registerByEmail,
  loginByEmail,
  verifyEmailOTP,
  registerByNumber,
  loginByNumber,
  verifyNumberOTP,
  isInstructorPage,
} = require("../../Controller/User/userController");

// Middle ware
const { verifyUserJWT } = require("../../Middleware/verifyJWTToken");

const user = express.Router();

// BIO
user.post("/registerByEmail", registerByEmail);
user.post("/loginByEmail", loginByEmail);
user.post("/verifyEmailOTP", verifyEmailOTP);
user.post("/registerByNumber", registerByNumber);
user.post("/loginByNumber", loginByNumber);
user.post("/verifyNumberOTP", verifyNumberOTP);
user.post("/instructor-user", verifyUserJWT, isInstructorPage);

module.exports = user;
