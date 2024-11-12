const express = require("express");
const { homeTutorTerm } = require("../../../Controller/User/userController");
const {
  createHomeTutor,
  addHTutorSeviceArea,
  addHTutorTimeSlote,
  addHTutorImage,
} = require("../../../Controller/HomeTutor/createHomeTutorController");
const {
  getHTAverageRating,
  getHTReview,
  updateHTReview,
  softDeleteHTReview,
} = require("../../../Controller/Review/hTReviewController");
const {
  getMyHomeTutorForInstructor,
  getHomeTutorById,
  getHTTimeSlote,
  getUserNotification,
  getHTServiceAreaByHTId,
} = require("../../../Controller/HomeTutor/getHomeTutorController");
const {
  publishHomeTutor,
  changeHTTimeSloteStatus,
  viewUserNotifications,
} = require("../../../Controller/HomeTutor/approveHomeTutorController");
const {
  softDeleteHTutorImage,
  softDeleteHTutorServiceArea,
  softDeleteHTutorTimeSlote,
  softDeleteHomeTutor,
} = require("../../../Controller/HomeTutor/deleteHomeTutorController");
const {
  updateHomeTutor,
  updateHTServiceArea,
} = require("../../../Controller/HomeTutor/updateHomeTutorController");
const {
  getMyHTBookedSloteForInstructor,
} = require("../../../Controller/HomeTutor/hTBookingController");

const instructor = express.Router();

// Term and condition
instructor.put("/homeTutorTerm", homeTutorTerm);

instructor.use((req, res) => {
  if (req.user.homeTutorTermAccepted === true) {
    req.userCode = req.user.userCode;
    next();
  } else {
    return res.status(400).json({
      success: false,
      message: "Please accept term and condition for Home Tutor!",
    });
  }
});

// Home Tutor Review
instructor.get("/hTReview/:id", getHTReview); //id = homeTutorId
instructor.get("/hTAverageRating/:id", getHTAverageRating); //id = homeTutorId
instructor.delete("/deleteHTReview/:id", softDeleteHTReview); //id = review Id
instructor.delete("/updateHTReview/:id", updateHTReview); //id = review Id

// Home Tutor
instructor.post("/createHomeTutor", createHomeTutor);
instructor.post("/addHTutorSeviceArea/:id", addHTutorSeviceArea);
instructor.post("/addHTutorTimeSlote/:id", addHTutorTimeSlote);
instructor.post(
  "/addHTutorImage/:id",
  uploadImage.array("hTutorImages", 3),
  addHTutorImage
);

instructor.get("/homeTutors", getMyHomeTutorForInstructor);
instructor.get("/homeTutors/:id", getHomeTutorById);
instructor.get("/hTTimeSlote/:id", getHTTimeSlote);

instructor.get("/userNotifications", getUserNotification);
instructor.get("/hTServiceArea/:id", getHTServiceAreaByHTId);
instructor.put("/viewUserNotifications", viewUserNotifications);

instructor.get("/myHTBookedSlotes", getMyHTBookedSloteForInstructor);

instructor.put("/publishHomeTutor/:id", publishHomeTutor);
instructor.put("/changeHTTimeSloteStatus/:id", changeHTTimeSloteStatus);

instructor.put("/updateHomeTutor/:id", updateHomeTutor);

instructor.put("/updateHTServiceArea/:id", updateHTServiceArea);

instructor.delete("/deleteHTutorImage/:id", softDeleteHTutorImage);
instructor.delete("/deleteHTutorServiceArea/:id", softDeleteHTutorServiceArea);
instructor.delete("/deleteHTutorTimeSlote/:id", softDeleteHTutorTimeSlote);
instructor.delete("/deleteHomeTutor/:id", softDeleteHomeTutor);

module.exports = instructor;
