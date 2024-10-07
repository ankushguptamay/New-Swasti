const express = require("express");
const {
  getUser,
  getMyChakra,
  getReferralData,
  updateStudent,
} = require("../../../Controller/User/userController");
const {
  addUpdateUserProfile,
  deleteUserProfile,
} = require("../../../Controller/User/userProfileController");
const {
  addAddress,
  updateAddress,
  softDeleteAddress,
  getAddressDetails,
  getAllAddress,
} = require("../../../Controller/User/addressController");
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
student.put("/profile", verifyUserJWT, updateStudent);

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

student.post("/address", verifyUserJWT, addAddress);
student.get("/address", verifyUserJWT, getAllAddress);
student.get("/address/:id", verifyUserJWT, getAddressDetails);
student.put("/address/:id", verifyUserJWT, updateAddress);
student.delete("/address/:id", verifyUserJWT, softDeleteAddress);

student.use("/ht", homeTutors);
student.use("/pub", publice);

module.exports = student;
