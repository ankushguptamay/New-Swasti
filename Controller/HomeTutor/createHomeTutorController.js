const db = require("../../Models");
const { Op } = require("sequelize");
const {
  homeTutorValidation,
  hTutorLocationValidation,
  hTutorTimeSloteValidation,
  hTutorPriceValidation,
} = require("../../Middleware/Validate/validateHomeTutor");
const { deleteSingleFile } = require("../../Util/deleteFile");
const generateOTP = require("../../Util/generateOTP");
const HomeTutor = db.homeTutor;
const HTServiceArea = db.hTServiceArea;
const HTTimeSlot = db.hTTimeSlote;
const HomeTutorHistory = db.homeTutorHistory;
const HTutorImages = db.hTImage;
const HTPrice = db.hTPrice;
// const User = db.user;

const { uploadFileToBunny } = require("../../Util/bunny");
const { SHOW_BUNNY_FILE_HOSTNAME } = process.env;
const fs = require("fs");
const bunnyFolderName = "ht-doc";

exports.createHomeTutor = async (req, res) => {
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

    // Store in database
    const homeTutor = await HomeTutor.create({
      yogaFor: yogaFor,
      homeTutorName: homeTutorName,
      isPrivateSO: isPrivateSO,
      isGroupSO: isGroupSO,
      language: language,
      specilization: specilization,
      instructorBio: instructorBio,
      instructorId: req.user.id,
      approvalStatusByAdmin: null,
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
      updatedBy: "Instructor",
    });

    // Final Response
    res.status(200).send({
      success: true,
      message: "Home Tutor created successfully!",
      data: { homeTutorId: homeTutor.id },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.addHTutorSeviceArea = async (req, res) => {
  try {
    // Validate Body
    const { error } = hTutorLocationValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { locationName, latitude, longitude, radius, unit } = req.body;
    const homeTutorId = req.params.id;
    // Check is this home tutor present and created by same instructor
    const isHomeTutor = await HomeTutor.findOne({
      where: {
        id: homeTutorId,
        instructorId: req.user.id,
      },
    });
    if (!isHomeTutor) {
      return res.status(400).send({
        success: false,
        message: "This home tutor is not present!",
      });
    }
    const slote = await HTServiceArea.findOne({
      where: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
    if (slote) {
      return res.status(400).send({
        success: false,
        message: "This service area is present!",
      });
    }
    // Store in database
    await HTServiceArea.create({
      locationName: locationName,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: radius,
      unit: unit,
      homeTutorId: homeTutorId,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Sevice area added successfully!",
      data: { homeTutorId: homeTutorId },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.addHTutorTimeSlote = async (req, res) => {
  try {
    // Validate Body
    const { error } = hTutorTimeSloteValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const {
      startTime,
      startDate,
      endDate,
      timeDurationInMin,
      serviceType,
      newServiceArea,
      noOfPeople,
      isOnline,
      newPrice,
    } = req.body;
    // Check home tutor present or not
    const homeTutorId = req.params.id;
    const homeTutor = await HomeTutor.findOne({
      where: { id: homeTutorId, deletedThrough: null },
      attributes: ["id", "isGroupSO", "isPrivateSO"],
      raw: true,
    });
    if (!homeTutor) {
      return res.status(400).send({
        success: false,
        message: "This home tutor is not present!",
      });
    }
    // Validate group or private
    if (serviceType === "Group") {
      if (!homeTutor.isGroupSO) {
        return res.status(400).send({
          success: false,
          message:
            "You do not provide group classes on the bases of your home tutor information!",
        });
      }
    } else if (serviceType === "Private") {
      if (!homeTutor.isGroupSO) {
        return res.status(400).send({
          success: false,
          message:
            "You do not provide private classes on the bases of your home tutor information!",
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "Class service type is not define!",
      });
    }

    let serviceAreaId = req.body.serviceAreaId;
    let priceId = req.body.priceId;
    // Serivce Area
    if (serviceAreaId) {
      const isSAPresent = await HTServiceArea.findOne({
        where: { id: serviceAreaId, homeTutorId },
      });
      if (!isSAPresent) {
        return res.status(400).send({
          success: false,
          message: "This service area is not present!",
        });
      }
    } else if (newServiceArea) {
      if (
        newServiceArea.locationName &&
        newServiceArea.latitude &&
        newServiceArea.longitude &&
        newServiceArea.radius &&
        newServiceArea.unit
      ) {
        const isService = await HTServiceArea.findOne({
          where: {
            latitude: parseFloat(newServiceArea.latitude),
            longitude: parseFloat(newServiceArea.longitude),
          },
        });
        if (!isService) {
          const area = await HTServiceArea.create({
            locationName: newServiceArea.locationName,
            latitude: parseFloat(newServiceArea.latitude),
            longitude: parseFloat(newServiceArea.longitude),
            radius: newServiceArea.radius,
            unit: newServiceArea.unit,
            homeTutorId: homeTutorId,
          });
          serviceAreaId = area.dataValues.id;
        } else {
          serviceAreaId = isService.dataValues.id;
        }
      } else {
        return res.status(400).send({
          success: false,
          message: "Please send all required fields in service area!",
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "Please select a service area!",
      });
    }

    // Price
    if (priceId) {
      const isPricePresent = await HTPrice.findOne({
        where: { id: priceId, homeTutorId },
      });
      if (!isPricePresent) {
        return res.status(400).send({
          success: false,
          message: "This price chart is not present!",
        });
      }
    } else if (newPrice) {
      if (
        newPrice.priceName &&
        newPrice.private_PricePerDayPerRerson &&
        newPrice.group_PricePerDayPerRerson &&
        newPrice.durationType
      ) {
        // Check is hometutor execpted required condition
        const private_PricePerDayPerRerson = homeTutor.isPrivateSO
          ? newPrice.private_PricePerDayPerRerson
          : null;
        const group_PricePerDayPerRerson = homeTutor.isGroupSO
          ? newPrice.group_PricePerDayPerRerson
          : null;

        const isPrice = await HTPrice.findOne({
          where: { priceName, durationType },
          raw: true,
        });
        if (!isPrice) {
          const price = await HTPrice.create({
            priceName: newPrice.priceName,
            private_PricePerDayPerRerson,
            group_PricePerDayPerRerson,
            durationType: newPrice.durationType,
            homeTutorId: homeTutorId,
          });
          priceId = price.dataValues.id;
        } else {
          priceId = isPrice.dataValues.id;
        }
      } else {
        return res.status(400).send({
          success: false,
          message: "Please send all required fields to add price!",
        });
      }
    } else {
      return res.status(400).send({
        success: false,
        message: "Please select a price chart!",
      });
    }

    // Date validation
    const todayIST = new Date();
    todayIST.setMinutes(todayIST.getMinutes() + 330);
    if (
      new Date(`${startDate}T${startTime}:00.000Z`).getTime() <
        todayIST.getTime() ||
      new Date(`${endDate}T${startTime}:00.000Z`).getTime() < todayIST.getTime()
    ) {
      return res.status(400).send({
        success: false,
        message: "Please select appropriate date!",
      });
    }

    // Create array of dates
    function getDifferenceInDays(date1, date2) {
      const timeDiff = Math.abs(new Date(date2) - new Date(date1));
      const diffInDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return diffInDays;
    }
    const noOfDate = getDifferenceInDays(startDate, endDate) + 1;
    const date = [];
    for (let i = 0; i < noOfDate; i++) {
      const today = new Date(startDate);
      today.setDate(today.getDate() + i);
      date.push(today.toISOString().slice(0, 10));
    }

    // Store in database
    for (let j = 0; j < date.length; j++) {
      // Get All Today Code
      let code;
      const day = date[j].slice(8, 10);
      const year = date[j].slice(2, 4);
      const month = date[j].slice(5, 7);
      const indtructorNumb = `${req.userCode.slice(4)}${day}${month}${year}`;
      const isSloteCode = await HTTimeSlot.findAll({
        where: {
          sloteCode: { [Op.startsWith]: indtructorNumb },
        },
        order: [["createdAt", "ASC"]],
        paranoid: false,
      });

      if (isSloteCode.length > 0) {
        code = isSloteCode[isSloteCode.length - 1].sloteCode;
      }

      const otp = generateOTP.generateFixedLengthRandomNumber(
        process.env.OTP_DIGITS_LENGTH
      );
      // Generating Code
      const isSlote = await HTTimeSlot.findOne({
        where: {
          time: startTime,
          date: date[j],
          homeTutorId: homeTutorId,
        },
      });
      if (!isSlote) {
        if (!code) {
          code = indtructorNumb + 1;
        } else {
          const digit = indtructorNumb.length;
          let lastDigits = code.substring(digit);
          let incrementedDigits = parseInt(lastDigits, 10) + 1;
          code = indtructorNumb + incrementedDigits;
        }
        // Store in database
        await HTTimeSlot.create({
          date: date[j],
          password: otp,
          isOnline: isOnline,
          timeDurationInMin: timeDurationInMin,
          sloteCode: code,
          serviceType: serviceType,
          noOfPeople: serviceType === "Private" ? 1 : noOfPeople,
          time: startTime,
          isBooked: false,
          serviceAreaId,
          durationType: priceId,
          appointmentStatus: "Active",
          homeTutorId: homeTutorId,
        });
      }
    }
    // Final Response
    res.status(200).send({
      success: true,
      message: "Time slote added successfully!",
      data: { homeTutorId: homeTutorId },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.addHTutorImage = async (req, res) => {
  try {
    // File should be exist
    if (!req.files) {
      return res.status(400).send({
        success: false,
        message: "Please..Upload image!",
      });
    }
    const homeTutorId = req.params.id;
    const files = req.files;
    // Check is this home tutor present and created by same instructor
    const isHomeTutor = await HomeTutor.findOne({
      where: {
        id: homeTutorId,
        instructorId: req.user.id,
      },
    });
    if (!isHomeTutor) {
      // Delete File from server
      for (let i = 0; i < files.length; i++) {
        deleteSingleFile(files[i].path);
      }
      return res.status(400).send({
        success: false,
        message: "This home tutor is not present!",
      });
    }
    // How mant file in already present
    const maxFileUpload = 3;
    const images = await HTutorImages.count({
      where: { homeTutorId: homeTutorId, deletedThrough: null },
    });
    const fileCanUpload = maxFileUpload - parseInt(images);
    for (let i = 0; i < files.length; i++) {
      if (i < fileCanUpload) {
        //Upload file
        const fileStream = fs.createReadStream(files[i].path);
        await uploadFileToBunny(bunnyFolderName, fileStream, files[i].filename);
        await HTutorImages.create({
          originalName: files[i].originalname,
          path: `${SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${files[i].filename}`,
          fileName: files[i].filename,
          homeTutorId: homeTutorId,
        });
      }
      deleteSingleFile(files[i].path);
    }
    // Final Response
    res.status(200).send({
      success: true,
      message: `${fileCanUpload} home tutor images added successfully!`,
      data: { homeTutorId: homeTutorId },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.addHTutorPrice = async (req, res) => {
  try {
    // Validate Body
    const { error } = hTutorPriceValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { priceName, durationType } = req.body;
    const homeTutorId = req.params.id;
    // Check is this home tutor present and created by same instructor
    const isHomeTutor = await HomeTutor.findOne({
      where: {
        id: homeTutorId,
        instructorId: req.user.id,
      },
      raw: true,
    });
    if (!isHomeTutor) {
      return res.status(400).send({
        success: false,
        message: "This home tutor is not present!",
      });
    }
    const price = await HTPrice.findOne({ where: { priceName, durationType } });
    if (price) {
      return res.status(400).send({
        success: false,
        message: "Same price chart already exist!",
      });
    }
    // Check is hometutor execpted required condition
    const private_PricePerDayPerRerson = isHomeTutor.isPrivateSO
      ? req.body.private_PricePerDayPerRerson
      : null;
    const group_PricePerDayPerRerson = isHomeTutor.isGroupSO
      ? req.body.group_PricePerDayPerRerson
      : null;

    // Store in database
    await HTPrice.create({
      priceName,
      private_PricePerDayPerRerson,
      group_PricePerDayPerRerson,
      durationType,
      homeTutorId: homeTutorId,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Price chart added successfully!",
      data: { homeTutorId: homeTutorId },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
