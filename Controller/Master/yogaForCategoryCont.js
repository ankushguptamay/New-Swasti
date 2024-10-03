const db = require("../../Models");
const {
  yogaForCategoryValidation,
} = require("../../Middleware/Validate/validateMaster");
const YogaForCategory = db.yogaForCategory;

exports.addYogaForCategory = async (req, res) => {
  try {
    // Validate Body
    const { error } = yogaForCategoryValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // Check duplicacy
    const yogaFor = req.body.yogaFor;
    const isPresent = await YogaForCategory.findOne({
      where: { yogaFor },
    });
    if (isPresent) {
      return res.status(400).send({
        success: false,
        message: "This category is present!",
      });
    }
    // create category
    await YogaForCategory.create({ yogaFor });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Category created successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllYogaForCategory = async (req, res) => {
  try {
    const category = await YogaForCategory.findAll();
    // Final Response
    res.status(200).send({
      success: true,
      message: "Category fetched successfully!",
      data: category,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteYogaForCategory = async (req, res) => {
  try {
    // Find In database
    const isPresent = await YogaForCategory.findOne({
      where: { id: req.params.id },
    });
    if (!isPresent) {
      return res.status(400).send({
        success: false,
        message: "This category is not present!",
      });
    }
    // delete Course category
    await isPresent.destroy();
    // Final Response
    res.status(200).send({
      success: true,
      message: "Category deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
