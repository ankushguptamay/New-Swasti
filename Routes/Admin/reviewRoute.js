const express = require("express");
const {
  deleteInstructorReview,
  getInstructorAverageRating,
  getInstructorReview,
} = require("../../Controller/Review/instructorReviewController");
const {
  getHTAverageRating,
  getHTReview,
  updateHTReview,
  softDeleteHTReview,
} = require("../../Controller/Review/hTReviewController");
const admin = express.Router();

// middleware
const { verifyAdminJWT } = require("../../Middleware/verifyJWTToken");
const { isAdminPresent } = require("../../Middleware/isPresent");

admin.use(verifyAdminJWT);
admin.use(isAdminPresent);

// 1. Instructor Review
admin.get("/getInstructorReview/:id", getInstructorReview); //id = instructorId
admin.get("/getInstructorAverageRating/:id", getInstructorAverageRating); //id = instructorId
admin.delete("/deleteInstructorReview/:id", deleteInstructorReview); //id = review Id

// 2. Home Tutor Review
admin.get("/hTReview/:id", getHTReview); //id = homeTutorId
admin.get("/hTAverageRating/:id", getHTAverageRating); //id = homeTutorId
admin.delete("/softDeleteHTReview/:id", softDeleteHTReview); //id = review Id
admin.put("/updateHTReview/:id", updateHTReview); //id = review Id

module.exports = admin;
