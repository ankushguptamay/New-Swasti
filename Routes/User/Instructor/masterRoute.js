const express = require("express");

const {
  getAllCourseCategory,
} = require("../../../Controller/Master/courseCategoryController");
const {
  getAllCourseDuration,
} = require("../../../Controller/Master/courseDurationController");
const {
  getAllCourseType,
} = require("../../../Controller/Master/courseTypeController");
const {
  getAllUniversity_Institute,
  getInstituteByUniversity,
  getOnlyUniversity,
} = require("../../../Controller/Master/university_instituteController");
const {
  getAllHTSpecilization,
} = require("../../../Controller/Master/hTSpecilizationController");
const {
  createCoupon,
  softDeleteCoupon,
  getAllInstructorCoupon,
  getCouponById,
  addCouponToCourse,
  getCouponToCourse,
  applyCouponToCourse,
} = require("../../../Controller/Master/couponController");
const {
  getAllCourseByType,
  getAllCourseByUniversityId,
} = require("../../../Controller/Master/courseDurationTypeController");

const instructor = express.Router();

// middleware
const { verifyUserJWT } = require("../../../Middleware/verifyJWTToken");
const { isInstructorProfileComplete } = require("../../../Middleware/isPresent");

instructor.use(verifyUserJWT);
instructor.use(isInstructorProfileComplete);

// Master
instructor.get("/coursecategories", getAllCourseCategory);
instructor.get("/courseDurations", getAllCourseDuration);
instructor.get("/courseTypes", getAllCourseType);

instructor.get("/university_institutes", getAllUniversity_Institute);
instructor.get("/university", getOnlyUniversity);
instructor.get("/institutes", getInstituteByUniversity);
instructor.get("/courseDurationTypes/:type", getAllCourseByType);
instructor.get("/courseDTByUniversity/:id", getAllCourseByUniversityId);
instructor.get("/hTSpecilizations", getAllHTSpecilization);

// 2. Coupon
instructor.post("/createCoupon", createCoupon);
instructor.delete("/softDeleteCoupon/:id", softDeleteCoupon);
instructor.get("/coupons", getAllInstructorCoupon);
instructor.get("/coupons/:id", getCouponById);
instructor.get("/couponToCourse/:id", getCouponToCourse);
instructor.put("/applyCouponToCourse", applyCouponToCourse);

module.exports = instructor;
