const db = require("../../Models");
const { Op } = require("sequelize");
const moment = require("moment");
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
      noOfPeopleCanBook,
      isOnline,
      newPrice,
    } = req.body;
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
    let price;
    if (priceId) {
      const isPricePresent = await HTPrice.findOne({
        where: { id: priceId, homeTutorId },
        raw: true,
        attributes: ["id", "durationType"],
      });
      if (!isPricePresent) {
        return res.status(400).send({
          success: false,
          message: "This price chart is not present!",
        });
      }
      price = isPricePresent;
    } else if (newPrice) {
      if (
        newPrice.priceName &&
        newPrice.private_PricePerDayPerRerson &&
        newPrice.group_PricePerDayPerRerson &&
        newPrice.private_totalPricePerPerson &&
        newPrice.group_totalPricePerPerson &&
        newPrice.durationType
      ) {
        price = newPrice;
        // Check is hometutor execpted required condition
        const private_PricePerDayPerRerson = homeTutor.isPrivateSO
          ? parseInt(newPrice.private_PricePerDayPerRerson)
          : null;
        const private_totalPricePerPerson = homeTutor.isPrivateSO
          ? parseInt(newPrice.private_totalPricePerPerson)
          : null;
        const group_PricePerDayPerRerson = homeTutor.isGroupSO
          ? parseInt(newPrice.group_PricePerDayPerRerson)
          : null;
        const group_totalPricePerPerson = homeTutor.isGroupSO
          ? parseInt(newPrice.group_totalPricePerPerson)
          : null;

        const isPrice = await HTPrice.findOne({
          where: { priceName, durationType },
          raw: true,
        });
        if (!isPrice) {
          const price = await HTPrice.create({
            priceName: newPrice.priceName,
            private_PricePerDayPerRerson,
            private_totalPricePerPerson,
            group_PricePerDayPerRerson,
            group_totalPricePerPerson,
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

    function getCoveredDates(slot) {
      const { startDate, endDate, dateDurationType } = slot;
      const start = moment(startDate);
      const end = moment(endDate);
      const coveredDates = [];

      if (dateDurationType === "daily") {
        if (startDate === endDate) {
          coveredDates.push(start.format("YYYY-MM-DD"));
        } else {
          let current = start.clone();
          while (current.isSameOrBefore(end)) {
            coveredDates.push(current.format("YYYY-MM-DD"));
            current.add(1, "days");
          }
        }
      } else if (dateDurationType.startsWith("weekly")) {
        const weeklyDay = parseInt(dateDurationType.split(" ")[1], 10); // Extract the weekday
        let current = start.clone().day(weeklyDay);
        if (current.isBefore(start)) current.add(1, "week"); // Ensure within range

        while (current.isSameOrBefore(end)) {
          coveredDates.push(current.format("YYYY-MM-DD"));
          current.add(1, "week");
        }
      } else if (dateDurationType.startsWith("monthly")) {
        const monthlyDay = parseInt(dateDurationType.split(" ")[1], 10); // Extract the day of the month
        let current = start.clone().date(monthlyDay);
        if (current.isBefore(start)) current.add(1, "month"); // Ensure within range

        while (current.isSameOrBefore(end)) {
          coveredDates.push(current.format("YYYY-MM-DD"));
          current.add(1, "month");
        }
      }
      return coveredDates;
    }

    // Function to check for overlap between two slots
    function isSlotOverlapping(existingSlot, newSlot) {
      const existingDates = getCoveredDates(existingSlot);
      const newDates = getCoveredDates(newSlot);
      const overlappingDates = existingDates.filter((date) =>
        newDates.includes(date)
      );
      if (overlappingDates.length === 0) return false;
      const newStartTime = moment(newSlot.startTime, "HH:mm");
      const newEndTime = newStartTime
        .clone()
        .add(newSlot.timeDrationInMin, "minutes");
      for (const date of overlappingDates) {
        const existingStartTime = moment(existingSlot.startTime, "HH:mm");
        const existingEndTime = existingStartTime
          .clone()
          .add(existingSlot.timeDrationInMin, "minutes");
        if (
          newStartTime.isBefore(existingEndTime) && // New slot starts before existing ends
          newEndTime.isAfter(existingStartTime) // New slot ends after existing starts
        ) {
          return true; // Overlap found
        }
      }
      return false;
    }

    // Function to validate all new slots against existing slots
    function validateSlots(existingSlots, newSlots) {
      const conflictingSlots = [];
      for (const newSlot of newSlots) {
        for (const existingSlot of existingSlots) {
          if (isSlotOverlapping(existingSlot, newSlot)) {
            conflictingSlots.push(newSlot);
            break; // No need to check further if overlap is found
          }
        }
      }
      return conflictingSlots;
    }

    // This function only supports daily dateDurationType
    function expandSlotToDailyArray(slot) {
      const { startDate, endDate } = slot;
      const start = moment(startDate);
      const end = moment(endDate);
      const dailySlots = [];

      let current = start.clone();
      while (current.isSameOrBefore(end)) {
        dailySlots.push({
          startDate: current.format("YYYY-MM-DD"),
          endDate: current.format("YYYY-MM-DD"),
        });
        current.add(1, "days");
      }

      return dailySlots;
    }

    // Slote Instructor want to create
    let newSlots = [
      {
        startDate,
        endDate,
        startTime,
        timeDurationInMin,
        durationType: price.durationType,
      },
    ];
    if (price.durationType === "daily") {
      const expandedSlots = expandSlotToDailyArray({ startDate, endDate });
      newSlots = [];
      for (let i = 0; i < expandedSlots.length; i++) {
        newSlots.push({
          ...expandedSlots[i],
          durationType: "daily",
          startTime,
          timeDurationInMin,
        });
      }
    }

    // Slote that are ongoing in database
    const today = moment().format("YYYY-MM-DD");
    const existingSlots = await HTTimeSlot.findAll({
      where: { endDate: { [Op.gte]: today }, homeTutorId },
      attributes: [
        "startDate",
        "endDate",
        "timeDurationInMin",
        "durationType",
        "startTime",
      ],
    });

    // Validate new slots
    if (existingSlots.length > 0) {
      const conflicting = validateSlots(existingSlots, newSlots);
      if (conflicting.length > 0) {
        return res.status(400).send({
          success: false,
          message: "Conflicting slots found!",
        });
      }
    }

    // Store in database
    for (let i = 0; i < newSlots.length; i++) {
      const otp = generateOTP.generateFixedLengthRandomNumber(
        process.env.OTP_DIGITS_LENGTH
      );
      await HTTimeSlot.create({
        startDate: newSlots[i].startDate,
        endDate: newSlots[i].endDate,
        password: otp,
        isOnline: isOnline,
        timeDurationInMin: timeDurationInMin,
        sloteCode: new Date().getTime(),
        serviceType: serviceType,
        noOfPeopleCanBook: serviceType === "Private" ? 1 : noOfPeopleCanBook,
        time: startTime,
        isBooked: false,
        serviceAreaId,
        durationType: price.durationType,
        priceId,
        appointmentStatus: "Active",
        homeTutorId: homeTutorId,
      });
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
    const private_totalPricePerPerson = homeTutor.isPrivateSO
      ? parseInt(newPrice.private_totalPricePerPerson)
      : null;
    const group_PricePerDayPerRerson = isHomeTutor.isGroupSO
      ? req.body.group_PricePerDayPerRerson
      : null;
    const group_totalPricePerPerson = homeTutor.isGroupSO
      ? parseInt(newPrice.group_totalPricePerPerson)
      : null;

    // Store in database
    await HTPrice.create({
      priceName,
      private_PricePerDayPerRerson,
      private_totalPricePerPerson,
      group_PricePerDayPerRerson,
      group_totalPricePerPerson,
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
