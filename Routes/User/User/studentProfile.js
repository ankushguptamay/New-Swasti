const express = require("express");
const {
  getUser,
  getMyChakra,
  getReferralData,
} = require("../../../Controller/User/userController");
const {
  addUpdateUserProfile,
  deleteUserProfile,
} = require("../../../Controller/User/userProfileController");
const homeTutors = require("./homeTutor");
const publice = require("./publicRoute");
const student = express.Router();

// middleware
const { verifyUserJWT } = require("../../../Middleware/verifyJWTToken");
const { isStudentPresent } = require("../../../Middleware/isPresent");
const uploadImage = require("../../../Middleware/uploadFile/image");

student.get("/", verifyUserJWT, getUser);
student.get("/chakras", verifyUserJWT, getMyChakra);
student.get("/referralDatas", verifyUserJWT, getReferralData);

student.post(
  "/profilePic",
  verifyUserJWT,
  isStudentPresent,
  uploadImage.single("StudentProfile"),
  addUpdateUserProfile
);
student.delete(
  "/profilePic/:id",
  verifyUserJWT,
  isStudentPresent,
  deleteUserProfile
);

student.use("ht", homeTutors);
student.use("pub", publice);

module.exports = student;
