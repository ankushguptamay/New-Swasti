const express = require("express");
const {
  register,
  login,
  getAdmin,
  changePassword,
  heartAPI,
} = require("../../Controller/Admin/adminController");
const homeTutor = require("./hTRoute");
const user = require("./userRoute");
const dashNoti = require("./dashBoardAndNotificationRoute");
const master = require("./masterRoute");
const review = require("./reviewRoute");

const admin = express.Router();

// middleware
const { verifyAdminJWT } = require("../../Middleware/verifyJWTToken");
const { isAdminPresent } = require("../../Middleware/isPresent");

// Admin
// admin.post("/register", register);
admin.post("/login", login);
admin.get("/admin", verifyAdminJWT, isAdminPresent, getAdmin);
admin.put("/changePassword", verifyAdminJWT, isAdminPresent, changePassword);

// Heart Api
admin.get("/heartAPI", heartAPI);

admin.use("/ht", homeTutor);
admin.use("/user", user);
admin.use("/mas", master);
admin.use("/review", review);
admin.use("/dash", dashNoti);

module.exports = admin;
