const db = require("../../Models");
const { Op } = require("sequelize");
const HomeTutor = db.homeTutor;
const HTServiceArea = db.hTServiceArea;
const HTTimeSlot = db.hTTimeSlote;
const HomeTutorHistory = db.homeTutorHistory;
const HTutorImages = db.hTImage;
const HTPrice = db.hTPrice;
const { deleteFileToBunny } = require("../../Util/bunny");

// Hard delete api is not make becasuse of payment

exports.softDeleteHomeTutor = async (req, res) => {
  try {
    let deletedThrough, condition;
    if (req.user) {
      condition = {
        id: req.params.id,
        instructorId: req.user.id,
      };
      deletedThrough = "Instructor";
    } else if (req.admin) {
      condition = {
        id: req.params.id,
      };
      deletedThrough = "Admin";
    } else {
      res.status(400).send({
        success: false,
        message: "You can not delete this home tutor!",
      });
    }
    // Find Home Tutor In Database
    const tutor = await HomeTutor.findOne({ where: condition, raw: true });
    if (!tutor) {
      return res.status(400).send({
        success: false,
        message: "Home tutor is not present!",
      });
    }
    await tutor.update({ deletedThrough: deletedThrough });
    // Soft Delete
    await tutor.destroy();
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.softDeleteHTutorServiceArea = async (req, res) => {
  try {
    let deletedThrough;
    if (req.user) {
      deletedThrough = "Instructor";
    } else if (req.admin) {
      deletedThrough = "Admin";
    } else {
      return res.status(400).send({
        success: false,
        message: "You can not delete this home tutor!",
      });
    }
    // Find Home Tutor service area In Database
    const area = await HTServiceArea.findOne({
      where: { id: req.params.id },
      raw: true,
    });
    if (!area) {
      return res.status(400).send({
        success: false,
        message: "Home tutor area is not present!",
      });
    }
    // Find All Service Area
    const totalArea = await HTServiceArea.count({
      where: { homeTutorId: area.homeTutorId },
    });
    if (parseInt(totalArea) <= 1) {
      return res.status(400).send({
        success: false,
        message: "There should be at least one service area present!",
      });
    }
    // Check is any timeSlote active and status booked
    const isSlote = await HTTimeSlot.findOne({
      where: {
        appointmentStatus: "Active",
        serviceAreaId: req.params.id,
        isBooked: true,
      },
    });
    if (isSlote) {
      return res.status(400).send({
        success: false,
        message: "There is an active booking pending on this service area!",
      });
    }
    await area.update({ deletedThrough: deletedThrough });
    // Soft Delete
    await area.destroy();
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor area deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.softDeleteHTutorImage = async (req, res) => {
  try {
    let deletedThrough;
    if (req.user) {
      deletedThrough = "Instructor";
    } else if (req.admin) {
      deletedThrough = "Admin";
    } else {
      return res.status(400).send({
        success: false,
        message: "You can not delete this home tutor!",
      });
    }
    // Find Home Tutor images In Database
    const images = await HTutorImages.findOne({
      where: { id: req.params.id },
      raw: true,
    });
    if (!images) {
      return res.status(400).send({
        success: false,
        message: "Home tutor images is not present!",
      });
    }
    // Find All Images
    const totalImages = await HTutorImages.count({
      where: { homeTutorId: images.homeTutorId },
    });
    if (parseInt(totalImages) <= 1) {
      return res.status(400).send({
        success: false,
        message: "There should be at least one image present!",
      });
    }
    await images.update({ deletedThrough: deletedThrough });
    // Soft Delete
    await images.destroy();
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor images deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.softDeleteHTutorTimeSlote = async (req, res) => {
  try {
    let deletedThrough;
    if (req.user) {
      deletedThrough = "Instructor";
    } else if (req.admin) {
      deletedThrough = "Admin";
    } else {
      return res.status(400).send({
        success: false,
        message: "You can not delete this home tutor!",
      });
    }
    // Find Home Tutor time slote In Database
    const slote = await HTTimeSlot.findOne({
      where: { id: req.params.id },
    });
    if (!slote) {
      return res.status(400).send({
        success: false,
        message: "Home tutor slote is not present!",
      });
    }
    if (slote.isBooked === true) {
      return res.status(400).send({
        success: false,
        message: "Home tutor slote is booked! You can not delete this slote!",
      });
    }
    await slote.update({ deletedThrough: deletedThrough });
    // Soft Delete
    await slote.destroy();
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor slote deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.hardDeleteHomeTutor = async (req, res) => {
  try {
    // Find Home Tutor In Database
    const tutor = await HomeTutor.findOne({
      where: { id: req.params.id },
      paranoid: false,
    });
    if (!tutor) {
      return res.status(400).send({
        success: false,
        message: "Home tutor is not present!",
      });
    }
    // Service Area
    await HTServiceArea.destroy({
      where: { homeTutorId: req.params.id },
      force: true,
    });
    // Time Slote
    await HTTimeSlot.destroy({
      where: { homeTutorId: req.params.id },
      force: true,
    });
    // Delete History
    await HomeTutorHistory.destroy({ where: { homeTutorId: req.params.id } });
    // Delete Images
    const images = await HTutorImages.findAll({
      where: { homeTutorId: req.params.id },
      paranoid: false,
    });
    const bunnyFolderName = "ht-doc";
    for (let i = 0; i < images.length; i++) {
      if (images[i].fileName) {
        await deleteFileToBunny(bunnyFolderName, images[i].fileName);
      }
    }
    await HTutorImages.destroy({
      where: { homeTutorId: req.params.id },
      force: true,
    });
    // Soft Delete
    await tutor.destroy({ force: true });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor hard deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.softDeleteHTutorPrice = async (req, res) => {
  try {
    let deletedThrough;
    if (req.user) {
      deletedThrough = "Instructor";
    } else if (req.admin) {
      deletedThrough = "Admin";
    } else {
      return res.status(400).send({
        success: false,
        message: "You can not delete this home tutor!",
      });
    }
    // Find Home Tutor price In Database
    const price = await HTPrice.findOne({
      where: { id: req.params.id },
      raw: true,
    });
    if (!price) {
      return res.status(400).send({
        success: false,
        message: "Home tutor price is not present!",
      });
    }
    // Find All price
    const totalPrice = await HTPrice.count({
      where: { homeTutorId: price.homeTutorId },
    });
    if (parseInt(totalPrice) <= 1) {
      return res.status(400).send({
        success: false,
        message: "There should be at least one price chart present!",
      });
    }
    // Check is any timeSlote active and status booked
    const isSlote = await HTTimeSlot.findOne({
      where: {
        appointmentStatus: "Active",
        priceId: req.params.id,
        isBooked: true,
      },
    });
    if (isSlote) {
      return res.status(400).send({
        success: false,
        message: "There is an active booking pending on this price!",
      });
    }
    await price.update({ deletedThrough: deletedThrough });
    // Soft Delete
    await price.destroy();
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor price deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
