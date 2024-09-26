const express = require("express");
const {
  createCourseCategory,
  getAllCourseCategory,
  deleteCourseCategory,
} = require("../../Controller/Master/courseCategoryController");
const {
  createCourseDuration,
  getAllCourseDuration,
  deleteCourseDuration,
} = require("../../Controller/Master/courseDurationController");
const {
  createCourseDurationType,
  deleteCourseDurationType,
  getAllCourseByType,
  getAllCourseDurationType,
} = require("../../Controller/Master/courseDurationTypeController");
const {
  createCourseType,
  getAllCourseType,
  deleteCourseType,
} = require("../../Controller/Master/courseTypeController");
const {
  createUniversity_Institute,
  getAllUniversity_Institute,
  getInstituteByUniversity,
  getOnlyUniversity,
  deleteUniversity_Institute,
  bulkCreateUniversity_Institute,
} = require("../../Controller/Master/university_instituteController");
const {
  createCoupon,
  getAllCouponForAdmin,
  softDeleteCoupon,
  restoreCoupon,
  changeCouponStatus,
  getAllSoftDeletedCoupon,
  getCouponById,
  getCouponToCourse,
  addCouponToCourse,
  applyCouponToCourse,
} = require("../../Controller/Master/couponController");
const {
  addAdminBanner,
  getAdminBanner,
  deleteAdminBanner,
} = require("../../Controller/Master/bannerController");
const {
  addHTSpecilization,
  getAllHTSpecilization,
  deleteHTSpecilization,
} = require("../../Controller/Master/hTSpecilizationController");
const admin = express.Router();

// middleware
const { verifyAdminJWT } = require("../../Middleware/verifyJWTToken");
const { isAdminPresent } = require("../../Middleware/isPresent");
const uploadImage = require("../../Middleware/uploadFile/image");

admin.use(verifyAdminJWT);
admin.use(isAdminPresent);

// 1. CourseCategory
admin.post("/createCourseCategory", createCourseCategory);
admin.get("/courseCategories", getAllCourseCategory);
admin.delete("/deleteCourseCategory/:id", deleteCourseCategory);
// 2. Coupon
admin.post("/createCoupon", createCoupon);
admin.get("/coupon", getAllCouponForAdmin);
admin.get("/deletedCoupons", getAllSoftDeletedCoupon);
admin.get("/coupon/:id", getCouponById);
admin.delete("/softDeleteCoupon/:id", softDeleteCoupon);
admin.put("/restoreCoupon/:id", restoreCoupon);
admin.put("/changeCouponStatus/:id", changeCouponStatus);
admin.get("/couponToCourse/:id", getCouponToCourse);
admin.put("/applyCouponToCourse", applyCouponToCourse);
// 3. CourseDuration
admin.post("/createCourseDuration", createCourseDuration);
admin.get("/courseDurations", getAllCourseDuration);
admin.delete("/deleteCourseDuration/:id", deleteCourseDuration);
// 4. CourseType
admin.post("/createCourseType", createCourseType);
admin.get("/courseTypes", getAllCourseType);
admin.delete("/deleteCourseType/:id", deleteCourseType);
// 5. University_Institute
admin.post("/university_institute", createUniversity_Institute);
admin.get("/university_institutes", getAllUniversity_Institute);
admin.get("/university", getOnlyUniversity);
admin.get("/institutes", getInstituteByUniversity);
admin.delete("/university_institute/:id", deleteUniversity_Institute);
admin.post("/bulkUniversity_institute", bulkCreateUniversity_Institute);
// 6.  CourseDurationType
admin.post("/createCourseDurationType", createCourseDurationType);
admin.get("/courseDurationTypes", getAllCourseDurationType);
admin.delete("/deleteCourseDurationType/:id", deleteCourseDurationType);
admin.get("/courseDurationTypes/:type", getAllCourseByType);
// 7. AdminBanner
admin.post(
  "/addAdminBanner",
  uploadImage.single("AdminBanner"),
  addAdminBanner
);
admin.get("/adminBanners", getAdminBanner);
admin.delete("/deleteAdminBanner/:id", deleteAdminBanner);
// 8. Home tutor Specilization
admin.post("/addHTSpecilization", addHTSpecilization);
admin.get("/hTSpecilizations", getAllHTSpecilization);
admin.delete("/deleteHTSpecilization/:id", deleteHTSpecilization);

module.exports = admin;
