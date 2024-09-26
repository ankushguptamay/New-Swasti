const express = require("express");
const {
  getAllSoftDeletedUser,
  getAllUser,
  getInstructorForAdmin,
  getUserForAdmin,
  softDeleteUser,
  restoreUser,
  registerUser,
} = require("../../Controller/User/userController");
const {
  changeQualificationStatus,
  softDeleteQualificationAdmin,
  restoreQualificationAdmin,
  getQualificationById,
  getSoftDeletedQualification,
} = require("../../Controller/User/Instructor/instructorQualificationController");
const {
  softDeleteExperienceAdmin,
  restoreExperienceAdmin,
  getExperienceById,
  getSoftDeletedExperience,
} = require("../../Controller/User/Instructor/instructorExperienceController");
const admin = express.Router();

// middleware
const { verifyAdminJWT } = require("../../Middleware/verifyJWTToken");
const { isAdminPresent } = require("../../Middleware/isPresent");

admin.use(verifyAdminJWT);
admin.use(isAdminPresent);

// Instructor Bio
admin.get("/user", getAllUser);
admin.get("/instructor/:id", getInstructorForAdmin);
admin.get("/user/:id", getUserForAdmin);
admin.get("/getAllSoftDeletedUsers", getAllSoftDeletedUser);
admin.post("/registerUser", registerUser);
admin.put("/restoreUser/:id", restoreUser);
admin.delete("/softDeleteUser/:id", softDeleteUser);

// Instructor Qualification
admin.get("/softDeletedQualification/:id", getSoftDeletedQualification); // id :instructorId
admin.get("/qualification/:id", getQualificationById);
admin.put("/changeQualificationStatus/:id", changeQualificationStatus);
admin.delete("/softDeleteQualification/:id", softDeleteQualificationAdmin);
admin.put("/restoreQualification/:id", restoreQualificationAdmin);

// Instructor Experience
admin.get("/softDeletedExperience/:id", getSoftDeletedExperience); // id :instructorId
admin.get("/experience/:id", getExperienceById);
admin.put("/restoreExperienceAdmin/:id", restoreExperienceAdmin);
admin.delete("/softDeleteExperienceAdmin/:id", softDeleteExperienceAdmin);

module.exports = admin;
