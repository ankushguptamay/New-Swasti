const express = require("express");
const {
  getHomeTutorForAdmin,
  getHomeTutorById,
  getHTutorUpdationRequestById,
  getHTTimeSlote,
  getAllDeletedHT,
  getDeletedHTImages,
  getDeletedHTServiceArea,
  getDeletedHTPrice,
  getDeletedHTTimeSlotes,
} = require("../../Controller/HomeTutor/getHomeTutorController");
const {
  changeHomeTutorStatus,
  changeHTutorUpdationStatus,
} = require("../../Controller/HomeTutor/approveHomeTutorController");
const {
  softDeleteHTutorImage,
  softDeleteHTutorServiceArea,
  softDeleteHTutorTimeSlote,
  softDeleteHomeTutor,
  hardDeleteHomeTutor,
} = require("../../Controller/HomeTutor/deleteHomeTutorController");
const {
  restoreHTutorImage,
  restoreHTutorServiceArea,
  restoreHTutorTimeSlote,
  restoreHomeTutor,
} = require("../../Controller/HomeTutor/restoreHomeTutorController");
const admin = express.Router();

// middleware
const { verifyAdminJWT } = require("../../Middleware/verifyJWTToken");
const { isAdminPresent } = require("../../Middleware/isPresent");

admin.use(verifyAdminJWT);
admin.use(isAdminPresent);

// Home Tutor
admin.get("/homeTutors", getHomeTutorForAdmin);
admin.get("/homeTutors/:id", getHomeTutorById);
admin.get("/hTutorUpdationRequest/:id", getHTutorUpdationRequestById);
admin.get("/hTTimeSlote/:id", getHTTimeSlote);

admin.get("/getAllDeletedHT", getAllDeletedHT);
admin.get("/getDeletedHTImages/:id", getDeletedHTImages); //id = homeTutorId
admin.get("/getDeletedHTServiceArea/:id", getDeletedHTServiceArea); //id = homeTutorId
admin.get("/getDeletedHTPrice/:id", getDeletedHTPrice); //id = homeTutorId
admin.get("/getDeletedHTTimeSlotes/:id", getDeletedHTTimeSlotes); //id = homeTutorId

admin.put("/changeHomeTutorStatus/:id", changeHomeTutorStatus);
admin.put("/changeHTutorUpdationStatus/:id", changeHTutorUpdationStatus);

admin.delete("/softDeleteHTutorImage/:id", softDeleteHTutorImage);
admin.delete("/softDeleteHTutorServiceArea/:id", softDeleteHTutorServiceArea);
admin.delete("/softDeleteHTutorTimeSlote/:id", softDeleteHTutorTimeSlote);
admin.delete("/softDeleteHomeTutor/:id", softDeleteHomeTutor);

admin.delete("/hardDeleteHomeTutor/:id", hardDeleteHomeTutor);

admin.put("/restoreHTutorImage/:id", restoreHTutorImage);
admin.put("/restoreHTutorServiceArea/:id", restoreHTutorServiceArea);
admin.put("/restoreHTutorTimeSlote/:id", restoreHTutorTimeSlote);
admin.put("/restoreHomeTutor/:id", restoreHomeTutor);

module.exports = admin;
