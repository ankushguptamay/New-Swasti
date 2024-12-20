const express = require("express");

const {
  addQualification,
  updateQualification,
  deleteQualificationInstructor,
  getQualificationById,
  getMyQualificationByqualificationIn,
} = require("../../../Controller/User/Instructor/instructorQualificationController");
const {
  updateInstructor,
  instructorTerm,
  getUser,
  getMyChakra,
  getReferralData,
} = require("../../../Controller/User/userController");
const {
  addAddress,
  updateAddress,
  softDeleteAddress,
  getAddressDetails,
  getAllAddress,
} = require("../../../Controller/User/addressController");
const {
  addExperience,
  updateExperiencen,
  deleteExperienceInstructor,
  getExperienceById,
} = require("../../../Controller/User/Instructor/instructorExperienceController");
const {
  addBankDetails,
  addKYC,
  getBankDetails,
  getKYC,
  deleteBankDetails,
  deleteKYC,
  updateBankDetails,
  updateKYC,
} = require("../../../Controller/User/Instructor/bankDetailsCont");
const {
  addUpdateUserProfile,
  deleteUserProfile,
} = require("../../../Controller/User/userProfileController");
const homeTutor = require("./homeTutorRoute");
const master = require("./masterRoute");

const instructor = express.Router();

// Middleware
const { verifyUserJWT } = require("../../../Middleware/verifyJWTToken");
const uploadImageAndPDF = require("../../../Middleware/uploadFile/imageAndPDF");
const uploadImage = require("../../../Middleware/uploadFile/image");

instructor.use(verifyUserJWT);

// Profile
instructor.put("/update", updateInstructor);
instructor.get("/", getUser);
instructor.get("/chakras", getMyChakra);
instructor.get("/referralDatas", getReferralData);

instructor.post(
  "/profilePic",
  uploadImage.single("profileImage"),
  addUpdateUserProfile
);
instructor.delete("/profilePic/:id", deleteUserProfile);

// Bank and KYC
instructor.get("/bankDetails", getBankDetails);
instructor.post("/bankDetails", addBankDetails);
instructor.get("/KYC", getKYC);
instructor.post("/KYC", addKYC);
instructor.put("/bankDetails/:id", updateBankDetails);
instructor.put("/KYC/:id", updateKYC);
instructor.delete("/bankDetails/:id", deleteBankDetails);
instructor.delete("/KYC/:id", deleteKYC);

// Term and condition
instructor.put("/instructorTerm", instructorTerm);

// Address
instructor.post("/address", addAddress);
instructor.get("/address", getAllAddress);
instructor.get("/address/:id", getAddressDetails);
instructor.put("/address/:id", updateAddress);
instructor.delete("/address/:id", softDeleteAddress);

// Blow this profile should be complete
instructor.use((req, res, next) => {
  if (req.user.isInstructor) {
    if (
      req.user.name &&
      req.user.email &&
      req.user.phoneNumber &&
      req.user.profilePic &&
      req.user.languages &&
      req.user.bio &&
      req.user.dateOfBirth &&
      req.user.totalExperienceInYears
    ) {
      if (req.user.profilePic.path) {
        req.userCode = req.user.userCode;
        next();
      } else {
        return res.status(400).json({
          success: false,
          message: "Please complete your profile!",
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile!",
      });
    }
  } else {
    return res.send({
      message: "Instructor is not present! Are you register?.. ",
    });
  }
});

// Qualification
instructor.get("/qualification/:id", getQualificationById);
instructor.post(
  "/qualification",
  uploadImageAndPDF.single("qualificationFile"),
  addQualification
);
instructor.put(
  "/qualification/:id",
  uploadImageAndPDF.single("qualificationFile"),
  updateQualification
);
instructor.delete("/qualification/:id", deleteQualificationInstructor);
instructor.get(
  "/qualificationIn/:qualificationIn",
  getMyQualificationByqualificationIn
);

// Experience
instructor.post("/experience", addExperience);
instructor.get("/experience/:id", getExperienceById);
instructor.put("/experience/:id", updateExperiencen);
instructor.delete("/experience/:id", deleteExperienceInstructor);

instructor.use("/ht", homeTutor);
instructor.use("/mas", master);

module.exports = instructor;
