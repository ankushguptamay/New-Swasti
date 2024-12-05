const db = require("../../Models");
const { Op } = require("sequelize");
const {
  homeTutorValidation,
  hTutorLocationValidation,
  hTutorPriceValidation,
} = require("../../Middleware/Validate/validateHomeTutor");
const HomeTutor = db.homeTutor;
const HTServiceArea = db.hTServiceArea;
const HTPrice = db.hTPrice;
const HomeTutorHistory = db.homeTutorHistory;

exports.updateHomeTutor = async (req, res) => {
  try {
    // Validate Body
    const { error } = homeTutorValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const {
      isPrivateSO,
      isGroupSO,
      language,
      yogaFor,
      homeTutorName,
      specilization,
      instructorBio,
    } = req.body;

    // Find in database
    const homeTutor = await HomeTutor.findOne({
      where: {
        id: req.params.id,
        instructorId: req.user.id,
      },
    });
    if (!homeTutor) {
      return res.status(400).send({
        success: false,
        message: "This home tutor is not present!",
      });
    }
    if (
      homeTutor.approvalStatusByAdmin === null ||
      homeTutor.approvalStatusByAdmin === "Pending"
    ) {
      await homeTutor.update({
        ...homeTutor,
        yogaFor: yogaFor,
        homeTutorName: homeTutorName,
        isPrivateSO: isPrivateSO,
        isGroupSO: isGroupSO,
        language: language,
        specilization: specilization,
        instructorBio: instructorBio,
      });
    } else {
      // Delete any updation request if present
      await HomeTutorHistory.destroy({
        where: {
          homeTutorId: homeTutor.id,
          updationStatus: "Pending",
        },
      });
      // create update history
      await HomeTutorHistory.create({
        yogaFor: yogaFor,
        homeTutorName: homeTutorName,
        isPrivateSO: isPrivateSO,
        isGroupSO: isGroupSO,
        language: language,
        specilization: specilization,
        instructorBio: instructorBio,
        homeTutorId: homeTutor.id,
        updationStatus: "Pending",
        updatedBy: "Instructor",
      });
      await homeTutor.update({
        ...homeTutor,
        anyUpdateRequest: true,
      });
    }
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home Tutor updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateHTServiceArea = async (req, res) => {
  try {
    // Validate Body
    const { error } = hTutorLocationValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { locationName, latitude, longitude, radius, unit } = req.body;
    // Find Home Tutor service area In Database
    const id = req.params.id;
    const area = await HTServiceArea.findOne({
      where: { id, deletedThrough: null },
      include: [
        {
          model: HomeTutor,
          as: "homeTutors",
          attributes: [
            "id",
            "approvalStatusByAdmin",
            "isPrivateSO",
            "isGroupSO",
          ],
          required: true,
        },
      ],
    });
    if (!area) {
      return res.status(400).send({
        success: false,
        message: "Home tutor area is not present!",
      });
    }

    if (area.dataValues.homeTutors.approvalStatusByAdmin === "Approved") {
      await area.update({ deletedThrough: "ByUpdation" });
      await area.destroy();
      // Create New One
      await HTServiceArea.create({
        locationName: locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: radius,
        unit: unit,
        homeTutorId: area.dataValues.homeTutorId,
      });
    } else {
      await area.update({
        locationName: locationName,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: radius,
        unit: unit,
      });
    }
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor area updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateHTPrice = async (req, res) => {
  try {
    // Validate Body
    const { error } = hTutorPriceValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { priceName, durationType } = req.body;
    // Find Home Tutor Price In Database
    const id = req.params.id;
    const price = await HTPrice.findOne({
      where: { id, deletedThrough: null },
      include: [
        {
          model: HomeTutor,
          as: "homeTutors",
          attributes: [
            "id",
            "approvalStatusByAdmin",
            "isPrivateSO",
            "isGroupSO",
          ],
          required: true,
        },
      ],
    });
    if (!price) {
      return res.status(400).send({
        success: false,
        message: "Home tutor price is not present!",
      });
    }

    // Check is hometutor execpted required condition
    const private_PricePerDayPerRerson = price.dataValues.homeTutors.isPrivateSO
      ? parseInt(req.body.private_PricePerDayPerRerson)
      : null;
    const private_totalPricePerPerson = price.dataValues.homeTutors.isPrivateSO
      ? parseInt(req.body.private_totalPricePerPerson)
      : null;
    const group_PricePerDayPerRerson = price.dataValues.homeTutors.isGroupSO
      ? parseInt(req.body.group_PricePerDayPerRerson)
      : null;
    const group_totalPricePerPerson = price.dataValues.homeTutors.isGroupSO
      ? parseInt(req.body.group_totalPricePerPerson)
      : null;

    if (price.dataValues.homeTutors.approvalStatusByAdmin === "Approved") {
      await price.update({ deletedThrough: "ByUpdation" });
      await price.destroy();
      // Create New One
      await HTPrice.create({
        priceName,
        private_PricePerDayPerRerson,
        private_totalPricePerPerson,
        group_PricePerDayPerRerson,
        group_totalPricePerPerson,
        durationType,
        homeTutorId: price.dataValues.homeTutorId,
      });
    } else {
      await price.update({
        priceName,
        private_PricePerDayPerRerson,
        private_totalPricePerPerson,
        group_PricePerDayPerRerson,
        group_totalPricePerPerson,
        durationType,
      });
    }
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor price updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
