const db = require("../Models");
const Admin = db.admin;
const User = db.user;
const UserProfile = db.userProfile;
const Address = db.address;
const { Op } = require("sequelize");

exports.isAdminPresent = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({
      where: {
        [Op.and]: [{ id: req.admin.id }, { email: req.admin.email }],
      },
    });
    if (!admin) {
      return res.send({
        message: "Admin is not present! Are you register?.. ",
      });
    }
    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.isInstructorForCourse = async (req, res, next) => {
  try {
    const instructor = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
          { isInstructor: true },
        ],
      },
      include: [
        {
          model: UserProfile,
          as: "profilePic",
          where: { deletedThrough: null },
          attributes: ["id", "path"],
          required: false,
        },
      ],
    });
    if (!instructor) {
      return res.send({
        message: "Instructor is not present! Are you register?.. ",
      });
    }
    if (
      instructor.name &&
      instructor.email &&
      instructor.phoneNumber &&
      instructor.profilePic &&
      instructor.languages &&
      instructor.bio &&
      instructor.dateOfBirth
    ) {
      if (instructor.profilePic.path) {
        if (instructor.instructorTermAccepted === true) {
          req.userCode = instructor.userCode;
          req.user = {
            ...req.user,
            name: instructor.name,
            isInstructor: instructor.isInstructor,
          };
          next();
        } else {
          return res.status(400).json({
            success: false,
            message: "Please accept term and condition for course!",
          });
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile!",
      });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.isInstructorForHomeTutor = async (req, res, next) => {
  try {
    const instructor = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
          { isInstructor: true },
        ],
      },
      include: [
        {
          model: UserProfile,
          as: "profilePic",
          where: { deletedThrough: null },
          attributes: ["id", "path"],
          required: false,
        },
      ],
    });
    if (!instructor) {
      return res.send({
        message: "Instructor is not present! Are you register?.. ",
      });
    }
    if (
      instructor.name &&
      instructor.email &&
      instructor.phoneNumber &&
      instructor.profilePic &&
      instructor.languages &&
      instructor.bio &&
      instructor.dateOfBirth
    ) {
      if (instructor.profilePic.path) {
        if (instructor.homeTutorTermAccepted === true) {
          req.userCode = instructor.userCode;
          req.user = {
            ...req.user,
            name: instructor.name,
            isInstructor: instructor.isInstructor,
          };
          next();
        } else {
          return res.status(400).json({
            success: false,
            message: "Please accept term and condition for Home Tutor!",
          });
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile!",
      });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.isInstructorForTherapist = async (req, res, next) => {
  try {
    const instructor = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
          { isInstructor: true },
        ],
      },
      include: [
        {
          model: UserProfile,
          as: "profilePic",
          where: { deletedThrough: null },
          attributes: ["id", "path"],
          required: false,
        },
      ],
    });
    if (!instructor) {
      return res.send({
        message: "Instructor is not present! Are you register?.. ",
      });
    }
    if (
      instructor.name &&
      instructor.email &&
      instructor.phoneNumber &&
      instructor.profilePic &&
      instructor.languages &&
      instructor.bio &&
      instructor.dateOfBirth
    ) {
      if (instructor.profilePic.path) {
        if (instructor.therapistTermAccepted === true) {
          req.userCode = instructor.userCode;
          req.user = {
            ...req.user,
            name: instructor.name,
            isInstructor: instructor.isInstructor,
          };
          next();
        } else {
          return res.status(400).json({
            success: false,
            message: "Please accept term and condition for Therapist!",
          });
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile!",
      });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.isInstructorForYogaStudio = async (req, res, next) => {
  try {
    const instructor = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
          { isInstructor: true },
        ],
      },
      include: [
        {
          model: UserProfile,
          as: "profilePic",
          where: { deletedThrough: null },
          attributes: ["id", "path"],
          required: false,
        },
      ],
    });
    if (!instructor) {
      return res.send({
        message: "Instructor is not present! Are you register?.. ",
      });
    }
    if (
      instructor.name &&
      instructor.email &&
      instructor.phoneNumber &&
      instructor.profilePic &&
      instructor.languages &&
      instructor.bio &&
      instructor.dateOfBirth
    ) {
      if (instructor.profilePic.path) {
        if (instructor.yogaStudioTermAccepted === true) {
          req.userCode = instructor.userCode;
          req.user = {
            ...req.user,
            name: instructor.name,
            isInstructor: instructor.isInstructor,
          };
          next();
        } else {
          return res.status(400).json({
            success: false,
            message: "Please accept term and condition for Yoga Studio!",
          });
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile!",
      });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.isInstructorProfileComplete = async (req, res, next) => {
  try {
    const instructor = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
          { isInstructor: true },
        ],
      },
      include: [
        {
          model: UserProfile,
          as: "profilePic",
          where: { deletedThrough: null },
          attributes: ["id", "path"],
          required: false,
        },
      ],
    });
    if (!instructor) {
      return res.send({
        message: "Instructor is not present! Are you register?.. ",
      });
    }
    if (
      instructor.name &&
      instructor.email &&
      instructor.phoneNumber &&
      instructor.profilePic &&
      instructor.languages &&
      instructor.bio &&
      instructor.dateOfBirth
    ) {
      if (instructor.profilePic.path) {
        req.userCode = instructor.userCode;
        req.user = {
          ...req.user,
          name: instructor.name,
          isInstructor: instructor.isInstructor,
        };
        next();
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Please complete your profile!",
      });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.isStudentPresent = async (req, res, next) => {
  try {
    const student = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
          { isInstructor: false },
        ],
      },
    });
    if (!student) {
      return res.send({
        message: "User is not present! Are you register?.. ",
      });
    }
    req.userName = student.name;
    req.user = {
      ...req.user,
      name: student.name,
      isInstructor: student.isInstructor,
    };
    next();
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
