const db = require("../../Models");
const { Op } = require("sequelize");
const User = db.user;

exports.totalStudent = async (req, res) => {
  try {
    // Total course
    const totalStudent = await User.count({ where: { isInstructor: false } });
    // Final Response
    res.status(200).send({
      success: true,
      message: `Total student fetched successfully!`,
      data: totalStudent,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.totalInstructor = async (req, res) => {
  try {
    const instructor = await User.count({ where: { isInstructor: true } });
    // Final Response
    res.status(200).send({
      success: true,
      message: `Total instructor fetched successfully!`,
      data: instructor,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.totalVerifiedInstructor = async (req, res) => {
  try {
    const instructor = await User.count({
      where: { isInstructor: true, isVerify: true },
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: `Total verified instructor fetched successfully!`,
      data: instructor,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.totalPendingInstructor = async (req, res) => {
  try {
    const instructor = await User.count({
      where: { isInstructor: true, isVerify: false },
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: `Total pending instructor fetched successfully!`,
      data: instructor,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
