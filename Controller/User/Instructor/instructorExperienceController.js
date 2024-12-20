const db = require("../../../Models");
const { Op } = require("sequelize");
const { addExperience } = require("../../../Middleware/Validate/validateUser");
const InstructorExperience = db.instructorExperience;
const Skill = db.skill;

exports.addExperience = async (req, res) => {
  try {
    // Validate Body
    const { error } = addExperience(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { workHistory, skills, role, organization, joinDate, department } =
      req.body;
    // Find in database
    await InstructorExperience.create({
      workHistory: workHistory,
      department: department,
      skills: skills,
      joinDate: joinDate,
      role: role,
      organization: organization,
      instructorId: req.user.id,
    });
    // Final response
    res.status(200).send({
      success: true,
      message: "Experience added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.softDeleteExperienceAdmin = async (req, res) => {
  try {
    const experience = await InstructorExperience.findOne({
      where: { id: req.params.id },
    });
    if (!experience) {
      return res.status(400).send({
        success: true,
        message: "This experience is not present!",
      });
    }
    await experience.update({ ...experience, deletedThrough: "Admin" });
    await experience.destroy();
    // Final response
    res.status(200).send({
      success: true,
      message: "Experience soft deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.restoreExperienceAdmin = async (req, res) => {
  try {
    const experience = await InstructorExperience.findOne({
      paranoid: false,
      where: {
        id: req.params.id,
        deletedAt: { [Op.ne]: null },
      },
    });
    if (!experience) {
      return res.status(400).send({
        success: true,
        message: "This experience is not present!",
      });
    }
    if (
      experience.deletedThrough === "Instructor" ||
      experience.deletedThrough === "ByUpdation"
    ) {
      return res.status(400).send({
        success: true,
        message: "Warning! This experience is not deleted by Swasti!",
      });
    }
    await experience.update({ ...experience, deletedThrough: null });
    // Restore
    await experience.restore();
    // Final response
    res.status(200).send({
      success: true,
      message: "Experience restored successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateExperiencen = async (req, res) => {
  try {
    // Validate Body
    const { error } = addExperience(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { workHistory, skills, role, organization, joinDate, department } =
      req.body;
    // Find in database
    const experience = await InstructorExperience.findOne({
      where: {
        id: req.params.id,
        instructorId: req.user.id,
      },
    });
    if (!experience) {
      return res.status(400).send({
        success: true,
        message: "This experience is not present!",
      });
    }
    await InstructorExperience.create({
      workHistory: workHistory,
      department: department,
      skills: skills,
      joinDate: joinDate,
      role: role,
      organization: organization,
      instructorId: req.user.id,
      createdAt: experience.createdAt,
    });

    await experience.update({ ...experience, deletedThrough: "ByUpdation" });
    // soft delete
    await experience.destroy();
    // Final response
    res.status(200).send({
      success: true,
      message: "Experience updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

// Soft Delete
exports.deleteExperienceInstructor = async (req, res) => {
  try {
    const experience = await InstructorExperience.findOne({
      where: { id: req.params.id },
    });
    if (!experience) {
      return res.status(400).send({
        success: true,
        message: "This experience is not present!",
      });
    }
    await experience.update({ ...experience, deletedThrough: "Instructor" });
    // Soft Delete
    await experience.destroy();
    // Final response
    res.status(200).send({
      success: true,
      message: "Experience deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getExperienceById = async (req, res) => {
  try {
    let argument = {
      where: { id: req.params.id },
      raw: true,
    };
    if (req.admin) {
      argument = { ...argument, paranoid: false };
    }
    let experience = await InstructorExperience.findOne(argument);
    if (!experience) {
      return res.status(400).send({
        success: true,
        message: "This experience is not present!",
      });
    }

    const skills = await Skill.findAll({
      where: { skill: JSON.parse(experience.skills) },
      attributes: ["id", "skill"],
      raw: true,
    });

    experience = { ...experience, skills };
    // Final response
    res.status(200).send({
      success: true,
      message: "Experience fetched successfully!",
      data: experience,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getSoftDeletedExperience = async (req, res) => {
  try {
    const argument = {
      where: {
        instructorId: req.params.id,
        deletedAt: { [Op.ne]: null },
      },
      paranoid: false,
    };
    const experience = await InstructorExperience.findAll(argument);
    // Final response
    res.status(200).send({
      success: true,
      message: "Soft deleted experience fetched successfully!",
      data: experience,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
