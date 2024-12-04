const db = require("../../Models");
const { skillValidation } = require("../../Middleware/Validate/validateMaster");
const { capitalizeFirstLetter } = require("../../Util/capitalizeFirstLetter");
const Skill = db.skill;

exports.createSkill = async (req, res) => {
  try {
    // Validate Body
    const { error } = skillValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // Check duplicacy
    const skill = capitalizeFirstLetter(req.body.skill);
    const isSkill = await Skill.findOne({ where: { skill } });
    if (isSkill) {
      return res.status(400).send({
        success: false,
        message: "This skill is already present!",
      });
    }

    // create skill
    await Skill.create({ skill });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Skill created successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllSkill = async (req, res) => {
  try {
    const skill = await Skill.findAll({ attributes: ["id", "skill"] });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Skill fetched successfully!",
      data: skill,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    // Find In database
    const isPresent = await Skill.findOne({
      where: { id: req.params.id },
    });
    if (!isPresent) {
      return res.status(400).send({
        success: false,
        message: "This skill is not present!",
      });
    }
    // delete Course category
    await isPresent.destroy();
    // Final Response
    res.status(200).send({
      success: true,
      message: "Skill deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
