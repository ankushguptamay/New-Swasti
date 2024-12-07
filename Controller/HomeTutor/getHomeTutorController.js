const db = require("../../Models");
const { Op } = require("sequelize");
const {
  getHomeTutorForUserValidation,
} = require("../../Middleware/Validate/validateHomeTutor");
const HomeTutor = db.homeTutor;
const HTServiceArea = db.hTServiceArea;
const HTTimeSlot = db.hTTimeSlote;
const HomeTutorHistory = db.homeTutorHistory;
const HTutorImages = db.hTImage;
const UserNotification = db.userNotification;
const InstructorExperience = db.instructorExperience;
const HTPrice = db.hTPrice;
const User = db.user;

exports.getMyHomeTutorForInstructor = async (req, res) => {
  try {
    const date = JSON.stringify(new Date());
    const todayDate = date.slice(1, 11);
    const homeTutor = await HomeTutor.findAll({
      where: {
        instructorId: req.user.id,
        deletedThrough: null,
      },
      include: [
        {
          model: HTServiceArea,
          as: "serviceAreas",
          where: {
            deletedThrough: null,
          },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedThrough"] },
          required: false,
        },
        {
          model: HTPrice,
          as: "hTPrices",
          where: {
            deletedThrough: null,
          },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedThrough"] },
          required: false,
        },
        {
          model: HTTimeSlot,
          as: "timeSlotes",
          where: {
            deletedThrough: null,
            startDate: todayDate,
          },
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedThrough"],
          },
          required: false,
        },
        {
          model: HTutorImages,
          as: "images",
          where: {
            deletedThrough: null,
          },
          attributes: ["id", "path", "createdAt"],
          required: false,
        },
      ],
    });
    // Auto submit for approval
    for (let i = 0; i < homeTutor.length; i++) {
      if (!homeTutor[i].approvalStatusByAdmin) {
        const language = homeTutor[i].language;
        const yogaFor = homeTutor[i].yogaFor;
        const images = homeTutor[i].images;
        const serviceAreas = homeTutor[i].serviceAreas;
        const specilization = homeTutor[i].specilization;
        if (
          specilization.length > 0 &&
          yogaFor.length > 0 &&
          language.length > 0 &&
          homeTutor[i].instructorBio
        ) {
          if (
            serviceAreas.length > 0 &&
            images.length > 0 &&
            homeTutor[i].hTPrices.length > 0
          ) {
            // Submit for approval
            await homeTutor[i].update({
              ...homeTutor[i],
              approvalStatusByAdmin: "Pending",
            });
          }
        }
      }
    }
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor fetched successfully!",
      data: homeTutor,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getHomeTutorForAdmin = async (req, res) => {
  try {
    const { page, limit, search, approvalStatusByAdmin } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }
    const condition = [];
    if (approvalStatusByAdmin) {
      condition.push({ approvalStatusByAdmin: approvalStatusByAdmin });
    }
    // Search
    // if (search) {
    //     condition.push({
    //         [Op.or]: [
    //             {}
    //         ]
    //     })
    // }
    // Count All Home Tutor
    const totalTutor = await HomeTutor.count({
      where: {
        [Op.and]: condition,
      },
    });
    const homeTutor = await HomeTutor.findAll({
      limit: recordLimit,
      offset: offSet,
      where: {
        [Op.and]: condition,
      },
      order: [["createdAt", "DESC"]],
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor fetched successfully!",
      totalPage: Math.ceil(totalTutor / recordLimit),
      currentPage: currentPage,
      data: homeTutor,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getHTServiceAreaByHTId = async (req, res) => {
  try {
    const hTServiceArea = await HTServiceArea.findAll({
      where: {
        homeTutorId: req.params.id,
        deletedThrough: null,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedThrough"] },
      raw: true,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "HT service area fetched successfully!",
      data: hTServiceArea,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getHTPriceByHTId = async (req, res) => {
  try {
    const hTPrice = await HTPrice.findAll({
      where: {
        homeTutorId: req.params.id,
        deletedThrough: null,
      },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedThrough"] },
      raw: true,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "HT Price fetched successfully!",
      data: hTPrice,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

// Admin and Instructor all not deleted
exports.getHomeTutorById = async (req, res) => {
  try {
    const date = JSON.stringify(new Date());
    const todayDate = date.slice(1, 11);
    const homeTutor = await HomeTutor.findOne({
      where: {
        id: req.params.id,
        deletedThrough: null,
      },
      include: [
        {
          model: HTServiceArea,
          as: "serviceAreas",
          where: {
            deletedThrough: null,
          },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedThrough"] },
          required: false,
        },
        {
          model: HTPrice,
          as: "hTPrices",
          where: {
            deletedThrough: null,
          },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedThrough"] },
          required: false,
        },
        {
          model: HTTimeSlot,
          as: "timeSlotes",
          where: {
            deletedThrough: null,
            startDate: todayDate,
          },
          attributes: {
            exclude: ["password", "createdAt", "updatedAt", "deletedThrough"],
          },
          required: false,
        },
        {
          model: HTutorImages,
          as: "images",
          where: {
            deletedThrough: null,
          },
          attributes: ["id", "path", "createdAt"],
          required: false,
        },
      ],
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor fetched successfully!",
      data: homeTutor,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getHTutorUpdationRequestById = async (req, res) => {
  try {
    const homeTutorHistory = await HomeTutorHistory.findAll({
      where: {
        homeTutorId: req.params.id,
        updationStatus: "Pending",
      },
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor updation request fetched successfully!",
      data: homeTutorHistory,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getHomeTutorForUser = async (req, res) => {
  try {
    // Validate Body
    const { error } = getHomeTutorForUserValidation(req.query);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const {
      page,
      limit,
      search,
      price,
      isPersonal,
      isGroup,
      language,
      latitude,
      longitude,
      experience,
      unit = "km",
      distance = 2,
      yogaFor,
    } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }
    const condition = [{ approvalStatusByAdmin: "Approved" }];
    // Search
    if (search) {
      condition.push({
        [Op.or]: [{ homeTutorName: { [Op.substring]: search } }],
      });
    }
    // Filter
    let instructorExperience = {
      model: User,
      as: "instructors",
      attributes: ["id", "totalExperienceInYears"],
    };
    if (experience) {
      instructorExperience = {
        ...instructorExperience,
        where: { totalExperienceInYears: { [Op.gte]: experience } },
        required: true,
      };
    }
    if (language && language.length > 0) {
      const languageCondition = [];
      for (const lang of language) {
        languageCondition.push({ language: { [Op.substring]: lang } });
      }
      condition.push({ [Op.or]: languageCondition });
    }
    if (yogaFor) {
      condition.push({ yogaFor: { [Op.substring]: yogaFor } });
    }
    if (isPersonal) {
      if (isPersonal == "true") {
        condition.push({ isPrivateSO: true });
      } else {
        condition.push({ isPrivateSO: false });
      }
    }
    if (isGroup) {
      if (isGroup == "true") {
        condition.push({ isGroupSO: true });
      } else {
        condition.push({ isGroupSO: false });
      }
    }
    const include = [
      {
        model: HTutorImages,
        as: "images",
        where: {
          deletedThrough: null,
        },
        attributes: ["path"],
        required: false,
      },
      instructorExperience,
    ];
    // Price
    if (price) {
      const priceTutor = {
        model: HTPrice,
        as: "hTPrices",
        where: {
          deletedThrough: null,
          [Op.or]: [
            { private_totalPricePerPerson: { [Op.lte]: parseFloat(price) } },
            { group_totalPricePerPerson: { [Op.lte]: parseFloat(price) } },
          ],
        },
        attributes: { exclude: ["createdAt", "updatedAt", "deletedThrough"] },
        required: true,
      };
      include.push(priceTutor);
    }
    // Location
    const areaTutorId = [];
    if (latitude && longitude) {
      const totalLocation = await HTServiceArea.scope({
        method: [
          "distance",
          parseFloat(latitude),
          parseFloat(longitude),
          distance,
          unit,
        ],
      }).findAll({
        attributes: ["id", "homeTutorId"],
        order: db.sequelize.col("distance"),
      });
      for (let i = 0; i < totalLocation.length; i++) {
        areaTutorId.push(totalLocation[i].homeTutorId);
      }
      condition.push({ id: areaTutorId });
    }

    // Count All Home Tutor
    const totalTutor = await HomeTutor.count({
      where: {
        [Op.and]: condition,
      },
    });
    const homeTutor = await HomeTutor.findAll({
      limit: recordLimit,
      offset: offSet,
      attributes: [
        "id",
        "homeTutorName",
        "isGroupSO",
        "isPrivateSO",
        "yogaFor",
        "instructorId",
        "approvalStatusByAdmin",
        "createdAt",
      ],
      where: {
        [Op.and]: condition,
      },
      include,
      order: [["createdAt", "DESC"]],
    });

    const transFormData = [];
    for (let i = 0; i < homeTutor.length; i++) {
      const [experiences, serviceAreas] = await Promise.all([
        InstructorExperience.findAll({
          where: {
            instructorId: homeTutor[i].dataValues.instructorId,
            deletedThrough: null,
          },
          attributes: ["id", "joinDate", "workHistory", "role"],
        }),
        HTServiceArea.scope({
          method: ["distance", latitude, longitude, distance, unit],
        }).findAll({
          where: {
            deletedThrough: null,
            homeTutorId: homeTutor[i].dataValues.id,
          },
          attributes: [
            "id",
            "locationName",
            "latitude",
            "longitude",
            "pincode",
          ],
          order: db.sequelize.col("distance"),
        }),
      ]);
      transFormData.push({
        ...homeTutor[i].dataValues,
        experiences: experiences.map((exp) => exp.get({ plain: true })),
        serviceAreas: serviceAreas.map((exp) => exp.get({ plain: true })),
      });
    }
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor fetched successfully!",
      totalPage: Math.ceil(totalTutor / recordLimit),
      currentPage: currentPage,
      data: transFormData,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getNearestHomeTutorForUser = async (req, res) => {
  try {
    const {
      page,
      limit,
      latitude,
      longitude,
      unit = "km",
      distance = 2,
    } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).send({
        success: false,
        message: "Location is required!",
      });
    }
    const recordLimit = parseInt(limit) || 10;
    let currentPage = parseInt(page) || 1;
    let offSet = (currentPage - 1) * recordLimit;

    // Count All Areas
    const [totalAreas, areas] = await Promise.all([
      HTServiceArea.scope({
        method: ["distance", latitude, longitude, distance, unit],
      }).findAll({
        attributes: ["id", "locationName", "latitude", "longitude", "pincode"],
        order: db.sequelize.col("distance"),
      }),
      HTServiceArea.scope({
        method: ["distance", latitude, longitude, distance, unit],
      }).findAll({
        attributes: ["id", "locationName", "latitude", "longitude", "pincode"],
        order: db.sequelize.col("distance"),
        limit: recordLimit,
        offset: offSet,
        include: [
          {
            model: HomeTutor,
            as: "homeTutors",
            where: { approvalStatusByAdmin: "Approved", deletedThrough: null },
            attributes: [
              "id",
              "homeTutorName",
              "isGroupSO",
              "isPrivateSO",
              "yogaFor",
              "instructorId",
              "approvalStatusByAdmin",
              "createdAt",
            ],
            include: [
              {
                model: HTutorImages,
                as: "images",
                where: {
                  deletedThrough: null,
                },
                attributes: ["path"],
                required: false,
              },
              {
                model: HTPrice,
                as: "hTPrices",
                where: {
                  deletedThrough: null,
                },
                attributes: {
                  exclude: ["createdAt", "updatedAt", "deletedThrough"],
                },
                required: false,
              },
            ],
          },
        ],
      }),
    ]);
    const transFormData = [];
    for (let i = 0; i < areas.length; i++) {
      const experiences = await InstructorExperience.findAll({
        where: {
          instructorId: areas[i].dataValues.homeTutors.instructorId,
          deletedThrough: null,
        },
        attributes: ["id", "joinDate", "workHistory", "role"],
      });
      const homeTutor = areas[i].dataValues.homeTutors;
      transFormData.push({
        ...homeTutor,
        experiences: experiences.map((exp) => exp.get({ plain: true })),
        images: areas[i].dataValues.homeTutors.images,
        hTPrices: areas[i].dataValues.homeTutors.hTPrices,
        serviceAreas: {
          id: areas[i].dataValues.id,
          locationName: areas[i].dataValues.locationName,
          latitude: areas[i].dataValues.latitude,
          longitude: areas[i].dataValues.longitude,
          pincode: areas[i].dataValues.pincode,
        },
      });
    }
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor fetched successfully!",
      totalPage: Math.ceil(totalAreas.length / recordLimit),
      currentPage: currentPage,
      data: transFormData,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getHomeTutorByIdForUser = async (req, res) => {
  try {
    const { latitude, longitude, distance = 20, unit = "km" } = req.query;

    if (latitude && longitude) {
      const date = JSON.stringify(new Date());
      const todayDate = date.slice(1, 11);
      const homeTutor = await HomeTutor.findOne({
        where: {
          id: req.params.id,
          deletedThrough: null,
          approvalStatusByAdmin: "Approved",
        },
        attributes: [
          "id",
          "homeTutorName",
          "isGroupSO",
          "isPrivateSO",
          "yogaFor",
          "instructorId",
          "approvalStatusByAdmin",
          "createdAt",
        ],
        include: [
          {
            model: HTTimeSlot,
            as: "timeSlotes",
            where: {
              deletedThrough: null,
              startDate: todayDate,
            },
            attributes: [
              "id",
              "startDate",
              "endDate",
              "time",
              "timeDurationInMin",
              "isBooked",
              "isOnline",
              "serviceType",
              "availableSeat",
              "bookedSeat",
              "sloteCode",
              "appointmentStatus",
              "createdAt",
            ],
            required: false,
          },
          {
            model: HTutorImages,
            as: "images",
            where: { deletedThrough: null },
            attributes: ["path"],
            required: false,
          },
          {
            model: HTPrice,
            as: "hTPrices",
            where: { deletedThrough: null },
            attributes: {
              exclude: ["createdAt", "updatedAt", "deletedThrough"],
            },
            required: false,
          },
          {
            model: User,
            as: "instructors",
            attributes: ["id", "totalExperienceInYears"],
            required: false,
          },
        ],
      });
      // Service Area
      const serviceAreas = await HTServiceArea.scope({
        method: ["distance", latitude, longitude, distance, unit],
      }).findAll({
        where: { deletedThrough: null, homeTutorId: req.params.id },
        attributes: ["id", "locationName", "latitude", "longitude", "pincode"],
        order: db.sequelize.col("distance"),
      });
      // Experience
      const experiences = await InstructorExperience.findAll({
        where: {
          instructorId: homeTutor.dataValues.instructorId,
          deletedThrough: null,
        },
        attributes: ["id", "joinDate", "workHistory", "role"],
        raw: true,
      });
      // Total Home tutor experience on swasti
      const oldestHomeTutor = await HomeTutor.findOne({
        attributes: ["id", "createdAt"],
        limit: 1,
        paranoid: false,
        order: [["createdAt", "DESC"]],
        raw: true,
      });
      // calculate days
      const provideingHTInDays = Math.floor(
        (new Date().getTime() - new Date(oldestHomeTutor.createdAt).getTime()) /
          (24 * 60 * 60 * 1000)
      );
      // Final Response
      res.status(200).send({
        success: true,
        message: "Home tutor fetched successfully!",
        data: {
          ...homeTutor.dataValues,
          serviceAreas,
          experiences,
          provideingHTInDays,
        },
      });
    } else {
      res.status(400).send({
        success: false,
        message: "User location is important!",
      });
    }
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getHTTimeSloteForUser = async (req, res) => {
  try {
    const { date } = req.query;
    const yesterday = new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000);
    let today = JSON.stringify(new Date());
    if (date) {
      const bookingDate = new Date(date).getTime();
      if (bookingDate <= yesterday) {
        return res.status(400).send({
          success: false,
          message: `${date[i]} date is not acceptable!`,
        });
      } else {
        today = date;
      }
    } else {
      today = today.slice(1, 11);
    }
    const slote = await HTTimeSlot.findAll({
      where: {
        homeTutorId: req.params.id,
        deletedThrough: null,
        startDate: today,
      },
      include: [
        {
          model: HTServiceArea,
          as: "serviceArea",
          attributes: [
            "id",
            "locationName",
            "latitude",
            "radius",
            "unit",
            "longitude",
            "pincode",
          ],
        },
        {
          model: HTPrice,
          as: "hTPrices",
          where: {
            deletedThrough: null,
          },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedThrough"] },
          required: false,
        },
      ],
    });
    const homeTutor = await HomeTutor.findOne({ where: { id: req.params.id } });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor Time slote fetched successfully!",
      data: {
        slote: slote,
        homeTutor: homeTutor,
      },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getHTTimeSlote = async (req, res) => {
  try {
    const { date } = req.query;
    const slote = await HTTimeSlot.findAll({
      where: {
        homeTutorId: req.params.id,
        deletedThrough: null,
        startDate: date,
      },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: HTServiceArea,
          as: "serviceArea",
          attributes: [
            "id",
            "locationName",
            "latitude",
            "radius",
            "unit",
            "longitude",
            "pincode",
          ],
        },
        {
          model: HTPrice,
          as: "hTPrices",
          where: {
            deletedThrough: null,
          },
          attributes: { exclude: ["createdAt", "updatedAt", "deletedThrough"] },
          required: false,
        },
      ],
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Home tutor Time slote fetched successfully!",
      data: slote,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllDeletedHT = async (req, res) => {
  try {
    const { page, limit, search, deletedThrough } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }
    const condition = [{ deletedAt: { [Op.ne]: null } }];
    // Search
    if (search) {
      condition.push({
        [Op.or]: [{ approvalStatusByAdmin: search }],
      });
    }
    // Deleted Through
    if (deletedThrough) {
      condition.push({ deletedThrough: deletedThrough });
    }
    // Count All Home Tutor
    const totalTutor = await HomeTutor.count({
      where: {
        [Op.and]: condition,
      },
      paranoid: false,
    });
    const homeTutor = await HomeTutor.findAll({
      limit: recordLimit,
      offset: offSet,
      where: {
        [Op.and]: condition,
      },
      paranoid: false,
      order: [["createdAt", "DESC"]],
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Deleted home tutor fetched successfully!",
      totalPage: Math.ceil(totalTutor / recordLimit),
      currentPage: currentPage,
      data: homeTutor,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getDeletedHTTimeSlotes = async (req, res) => {
  try {
    const { deletedThrough, date } = req.query;
    const condition = [
      {
        homeTutorId: req.params.id,
        deletedAt: { [Op.ne]: null },
      },
    ];
    if (deletedThrough) {
      condition.push({
        deletedThrough: deletedThrough,
      });
    }
    if (date) {
      condition.push({
        startDate: date,
      });
    }
    const timeSlote = await HTTimeSlot.findAll({
      where: {
        [Op.and]: condition,
      },
      paranoid: false,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Deleted home tutor time slotes fetched successfully!",
      data: timeSlote,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getDeletedHTImages = async (req, res) => {
  try {
    const { deletedThrough } = req.query;
    const condition = [
      {
        homeTutorId: req.params.id,
        deletedAt: { [Op.ne]: null },
      },
    ];
    if (deletedThrough) {
      condition.push({
        deletedThrough: deletedThrough,
      });
    }
    const images = await HTutorImages.findAll({
      where: {
        [Op.and]: condition,
      },
      paranoid: false,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Deleted home tutor images fetched successfully!",
      data: images,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getDeletedHTServiceArea = async (req, res) => {
  try {
    const { deletedThrough } = req.query;
    const condition = [
      {
        homeTutorId: req.params.id,
        deletedAt: { [Op.ne]: null },
      },
    ];
    if (deletedThrough) {
      condition.push({
        deletedThrough: deletedThrough,
      });
    }
    const area = await HTServiceArea.findAll({
      where: {
        [Op.and]: condition,
      },
      paranoid: false,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Deleted home tutor service areas fetched successfully!",
      data: area,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getUserNotification = async (req, res) => {
  try {
    const { page, limit, search } = req.query;
    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }
    const condition = [{ instructorId: req.user.id }];
    // Search
    if (search) {
      condition.push({
        [Op.or]: [
          { notification: { [Op.substring]: search } },
          { instructorServices: { [Op.substring]: search } },
          { response: { [Op.substring]: search } },
        ],
      });
    }
    // Count All notification
    const totalNotification = await UserNotification.count({
      where: {
        [Op.and]: condition,
      },
    });
    const notification = await UserNotification.findAll({
      limit: recordLimit,
      offset: offSet,
      where: {
        [Op.and]: condition,
      },
      order: [["createdAt", "DESC"]],
    });
    // Count All unViewed notification
    const totalUnViewed = await UserNotification.count({
      where: {
        instructorId: req.user.id,
        isViewed: false,
      },
    });
    const trafData = notification.map(
      ({ notification, id, isViewed, link, createdAt }) => {
        return {
          notification,
          id,
          isViewed,
          link,
          createdAt,
          instructorName: req.user.name,
        };
      }
    );
    // Final Response
    res.status(200).send({
      success: true,
      message: "Service notification fetched successfully!",
      totalPage: Math.ceil(totalNotification / recordLimit),
      currentPage: currentPage,
      data: { notification: trafData, unViewedNotification: totalUnViewed },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getDeletedHTPrice = async (req, res) => {
  try {
    const { deletedThrough } = req.query;
    const condition = [
      {
        homeTutorId: req.params.id,
        deletedAt: { [Op.ne]: null },
      },
    ];
    if (deletedThrough) {
      condition.push({ deletedThrough });
    }
    const price = await HTPrice.findAll({
      where: { [Op.and]: condition },
      paranoid: false,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Deleted price fetched successfully!",
      data: price,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getHTMorningEveningTimeSlote = async (req, res) => {
  try {
    const {
      date,
      page,
      limit,
      isPersonal,
      isGroup,
      price,
      language,
      latitude,
      longitude,
      isMorning,
      distance = 2,
      unit = "km",
      experience,
    } = req.query;

    // Pagination
    const recordLimit = parseInt(limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * recordLimit;
      currentPage = parseInt(page);
    }
    const condition = [
      { approvalStatusByAdmin: "Approved" },
      { deletedThrough: null },
    ];

    // Filter
    let instructorExperience = {
      model: User,
      as: "instructors",
      attributes: ["id", "totalExperienceInYears"],
    };
    if (experience) {
      instructorExperience = {
        ...instructorExperience,
        where: { totalExperienceInYears: { [Op.gte]: experience } },
        required: true,
      };
    }
    if (language && typeof language === "object" && language.length > 0) {
      const languageCondition = [];
      for (const lang of language) {
        languageCondition.push({ language: { [Op.substring]: lang } });
      }
      condition.push({ [Op.or]: languageCondition });
    }
    if (isPersonal) {
      if (isPersonal == "true") {
        condition.push({ isPrivateSO: true });
      } else {
        condition.push({ isPrivateSO: false });
      }
    }
    if (isGroup) {
      if (isGroup == "true") {
        condition.push({ isGroupSO: true });
      } else {
        condition.push({ isGroupSO: false });
      }
    }
    // Location is mendatory
    const areaTutorId = [];
    if (latitude && longitude) {
      const totalLocation = await HTServiceArea.scope({
        method: [
          "distance",
          parseFloat(latitude),
          parseFloat(longitude),
          distance,
          unit,
        ],
      }).findAll({
        attributes: ["id", "homeTutorId"],
        order: db.sequelize.col("distance"),
      });
      for (let i = 0; i < totalLocation.length; i++) {
        areaTutorId.push(totalLocation[i].homeTutorId);
      }
      condition.push({ id: areaTutorId });
    } else {
      res.status(400).send({
        success: false,
        message: "Your location is required!",
      });
    }

    // Price
    const include = [];
    if (price) {
      const priceCondition = {
        model: HTPrice,
        as: "hTPrices",
        where: {
          deletedThrough: null,
          [Op.or]: [
            { private_totalPricePerPerson: { [Op.lte]: parseFloat(price) } },
            { group_totalPricePerPerson: { [Op.lte]: parseFloat(price) } },
          ],
        },
        attributes: ["id", "homeTutorId"],
        required: true,
      };
      include.push(priceCondition);
    }

    const slotCondition = [{ deletedThrough: null }, { isBooked: false }];
    // Got All Home tutor
    const homeTutor = await HomeTutor.findAll({
      where: { [Op.and]: condition },
      attributes: ["id"],
      include,
    });
    const finalHomeTutorIds = [];
    for (let i = 0; i < homeTutor.length; i++) {
      finalHomeTutorIds.push(homeTutor[i].dataValues.id);
    }
    // Push finalHomeTutorIds in slot condition
    slotCondition.push({ homeTutorId: finalHomeTutorIds });

    // Morning Condition with perticular date
    let message = "Morning";
    const morning_evening = isMorning ? isMorning : "true";
    const todayDate = new Date(new Date().getTime() + 330 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    let today;
    if (date) {
      const bookingDate = new Date(date).getTime();
      if (bookingDate < new Date(todayDate).getTime()) {
        return res.status(400).send({
          success: false,
          message: `${date} date is not acceptable!`,
        });
      } else {
        today = date;
      }
    } else {
      today = todayDate;
    }
    slotCondition.push({ startDate: today });
    if (morning_evening == "true") {
      slotCondition.push({
        [Op.or]: [
          { time: { [Op.gte]: "01:00" } },
          { time: { [Op.lt]: "13:00" } },
        ],
      });
    } else {
      message = "Evening";
      slotCondition.push({
        [Op.or]: [
          { time: { [Op.gte]: "13:00" } },
          { time: { [Op.lt]: "23:59" } },
        ],
      });
    }

    // Fetch data
    const [totalSlote, slote] = await Promise.all([
      HTTimeSlot.count({
        where: { [Op.and]: slotCondition },
      }),
      HTTimeSlot.findAll({
        limit: recordLimit,
        offset: offSet,
        where: { [Op.and]: slotCondition },
        attributes: [
          "id",
          "startDate",
          "time",
          "timeDurationInMin",
          "isBooked",
          "isOnline",
          "serviceType",
          "availableSeat",
          "bookedSeat",
          "appointmentStatus",
          "serviceAreaId",
        ],
        include: [
          {
            model: HomeTutor,
            as: "homeTutors",
            attributes: [
              "id",
              "homeTutorName",
              "isGroupSO",
              "isPrivateSO",
              "yogaFor",
            ],
            include: [instructorExperience],
          },
        ],
      }),
    ]);

    const transFormData = [];
    for (let i = 0; i < slote.length; i++) {
      const serviceArea = await HTServiceArea.scope({
        method: ["distance", latitude, longitude, distance, unit],
      }).findOne({
        where: {
          deletedThrough: null,
          id: slote[i].dataValues.serviceAreaId,
        },
        attributes: ["id", "locationName", "latitude", "longitude", "pincode"],
        order: db.sequelize.col("distance"),
      });
      transFormData.push({ ...slote[i].dataValues, serviceArea });
    }

    // Final Response
    res.status(200).send({
      success: true,
      message: `${message} Time slote fetched successfully!`,
      totalPage: Math.ceil(totalSlote / recordLimit),
      currentPage: currentPage,
      data: transFormData,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
