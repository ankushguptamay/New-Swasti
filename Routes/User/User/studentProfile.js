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
const uploadImage = require("../../../Middleware/uploadFile/image");

// Public
student.use("/pub", publice);

student.use(verifyUserJWT);

student.get("/", getUser);
student.get("/chakras", getMyChakra);
student.get("/referralDatas", getReferralData);
student.put("/profile", updateStudent);

// Only for student
student.use((req, res, next) => {
  if (req.user.isInstructor === false) {
    req.userCode = req.user.userCode;
    next();
  } else {
    return res.send({
      message: "User is not present! Are you register?.. ",
    });
  }
});

student.post(
  "/profilePic",
  uploadImage.single("StudentProfile"),
  addUpdateUserProfile
);
student.delete("/profilePic/:id", deleteUserProfile);

student.post("/address", addAddress);
student.get("/address", getAllAddress);
student.get("/address/:id", getAddressDetails);
student.put("/address/:id", updateAddress);
student.delete("/address/:id", softDeleteAddress);

student.use("/ht", homeTutors);

module.exports = student;
