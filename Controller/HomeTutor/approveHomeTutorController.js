const db = require("../../Models");
const { Op } = require("sequelize");
const {
  changeQualificationStatus,
  changeHTTimeSloteStatus,
} = require("../../Middleware/Validate/validateUser");
const User = db.user;
const HomeTutor = db.homeTutor;
const HTTimeSlot = db.hTTimeSlote;
const HomeTutorHistory = db.homeTutorHistory;
const UserNotification = db.userNotification;

exports.changeHomeTutorStatus = async (req, res) => {
  try {
    // Validate Body
    const { error } = changeQualificationStatus(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { approvalStatusByAdmin } = req.body;
    // Find Tutor In Database
    const tutor = await HomeTutor.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!tutor) {
      return res.status(400).send({
        success: false,
        message: "This Home tutor is not present!",
      });
    }
    if (approvalStatusByAdmin === "Approved") {
      await User.update(
        { bio: tutor.instructorBio },
        { where: { id: tutor.instructorId } }
      );
    }
    // Update tutor
    await tutor.update({
      ...tutor,
      approvalStatusByAdmin: approvalStatusByAdmin,
      anyUpdateRequest: false,
    });
    // create service Notification
    await UserNotification.create({
      userId: tutor.instructorId,
      notification: `${tutor.homeTutorName} home tutor ${approvalStatusByAdmin} by Swasti!`,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: `Home tutor ${approvalStatusByAdmin} successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.changeHTTimeSloteStatus = async (req, res) => {
  try {
    // Validate Body
    const { error } = changeHTTimeSloteStatus(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { appointmentStatus, password } = req.body;
    // Find slote In Database
    const slote = await HTTimeSlot.findOne({
      where: {
        id: req.params.id,
        deletedThrough: null,
      },
    });
    if (!slote) {
      return res.status(400).send({
        success: false,
        message: "This slote is not present!",
      });
    }
    if (slote.isBooked === true) {
      if (!password) {
        return res.status(400).send({
          success: false,
          message: "Please enter the password!",
        });
      }
      if (parseInt(password) !== slote.password) {
        return res.status(400).send({
          success: false,
          message: "Invalid password!",
        });
      }
    }
    // Update slote
    await slote.update({
      ...slote,
      appointmentStatus: appointmentStatus,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: `Home slote ${appointmentStatus} successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.changeHTutorUpdationStatus = async (req, res) => {
  try {
    // Validate Body
    const { error } = changeQualificationStatus(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { approvalStatusByAdmin } = req.body;
    // Find Tutor In Database
    const history = await HomeTutorHistory.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!history) {
      return res.status(400).send({
        success: false,
        message: "This Home tutor is not present!",
      });
    }
    const homeTutor = await HomeTutor.findOne({
      where: {
        id: history.homeTutorId,
      },
    });
    if (approvalStatusByAdmin === "Approved") {
      await User.update(
        { bio: history.instructorBio },
        { where: { id: homeTutor.instructorId } }
      );
      await homeTutor.update({
        isGroupSO: history.isGroupSO,
        isPrivateSO: history.isPrivateSO,
        language: history.language,
        specilization: history.specilization,
        instructorBio: history.instructorBio,
      });
    }
    // Update tutor
    await history.update({
      ...history,
      updationStatus: approvalStatusByAdmin,
    });
    await homeTutor.update({
      ...homeTutor,
      anyUpdateRequest: false,
    });
    // create service Notification
    await UserNotification.create({
      userId: homeTutor.instructorId,
      notification: `${homeTutor.homeTutorName} your home tutor updation request ${approvalStatusByAdmin} by Swasti!`,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: `Request ${approvalStatusByAdmin} successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.viewUserNotifications = async (req, res) => {
  try {
    await UserNotification.update(
      { isViewed: true },
      { where: { userId: req.user.id } }
    );
    res.status(200).send({
      success: true,
      message: "Service notification viewed successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
