const express = require("express");
const {
  verifyHTPayment,
} = require("../../../Controller/HomeTutor/hTBookingController");
const {
  getAllYogaForCategory,
} = require("../../../Controller/Master/yogaForCategoryCont");
const student = express.Router();

student.post("/verifyHTPayment", verifyHTPayment);

student.post("/y-f-category", getAllYogaForCategory);

module.exports = student;
