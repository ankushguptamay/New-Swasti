const express = require("express");
const {
  totalStudent,
  totalInstructor,
  totalPendingInstructor,
  totalVerifiedInstructor,
} = require("../../Controller/Admin/dashboardController");
const {
  createNotificationForAdmin,
  getNotificationForAdmin,
  changeNotificationStatus,
} = require("../../Controller/createNotificationCont");
const {
  sendCampaignEmail,
  addCampaignEmailCredentials,
} = require("../../Controller/campaignEmailController");
const admin = express.Router();

// middleware
const { verifyAdminJWT } = require("../../Middleware/verifyJWTToken");
const { isAdminPresent } = require("../../Middleware/isPresent");

admin.use(verifyAdminJWT);
admin.use(isAdminPresent);

// Notification
admin.post("/createNotification", createNotificationForAdmin);
admin.get("/notifications", getNotificationForAdmin);
admin.put("/changeNotificationStatus/:id", changeNotificationStatus); // notificationId

// Dashboard
admin.get("/totalStudent", totalStudent);
admin.get("/totalInstructor", totalInstructor);
admin.get("/totalPendingInstructor", totalPendingInstructor);
admin.get("/totalVerifiedInstructor", totalVerifiedInstructor);

// Campaign
admin.post("/sendCampaignEmail", sendCampaignEmail);
admin.post("/addCampaignEmailCredentials", addCampaignEmailCredentials);

module.exports = admin;
