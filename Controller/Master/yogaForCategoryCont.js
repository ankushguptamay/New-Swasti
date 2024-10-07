const db = require("../../Models");
const {
  yogaForCategoryValidation,
} = require("../../Middleware/Validate/validateMaster");
const { uploadFileToBunny, deleteFileToBunny } = require("../../Util/bunny");
const { deleteSingleFile } = require("../../Util/deleteFile");
const { SHOW_BUNNY_FILE_HOSTNAME } = process.env;
const YogaForCategory = db.yogaForCategory;
const fs = require("fs");
const bunnyFolderName = "mst-doc";

exports.addYogaForCategory = async (req, res) => {
  try {
    // Validate Body
    const { error } = yogaForCategoryValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // Check duplicacy
    const { yogaFor, description } = req.body;
    const isPresent = await YogaForCategory.findOne({
      where: { yogaFor },
    });
    if (isPresent) {
      return res.status(400).send({
        success: false,
        message: "This category is present!",
      });
    }
    //Handel file if present
    let fileName, path;
    if (req.file) {
      const fileStream = fs.createReadStream(req.file.path);
      await uploadFileToBunny(bunnyFolderName, fileStream, req.file.filename);
      path = `${SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${req.file.filename}`;
      fileName = req.file.filename;
      // delete file from resource/servere
      deleteSingleFile(req.file.path);
    }
    // create category
    await YogaForCategory.create({ yogaFor, fileName, path, description });
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
    //Delete file
    if (isPresent.fileName) {
      await deleteFileToBunny(bunnyFolderName, isPresent.fileName);
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

exports.updateYogaForCategory = async (req, res) => {
  try {
    // Validate Body
    const { error } = yogaForCategoryValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const { yogaFor, description } = req.body;
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
    // Check duplicacy
    if (yogaFor !== isPresent.yogaFor) {
      const isYogaFor = await YogaForCategory.findOne({
        where: { yogaFor },
      });
      if (isYogaFor) {
        return res.status(400).send({
          success: false,
          message: "This category is already present!",
        });
      }
    }
    // update
    await isPresent.update({ yogaFor, description });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Category updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteYFCategoryFile = async (req, res) => {
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
    //Delete file
    if (isPresent.fileName) {
      await deleteFileToBunny(bunnyFolderName, isPresent.fileName);
    }
    //update
    await isPresent.update({ fileName: null, path: null });
    // Final Response
    res.status(200).send({
      success: true,
      message: "Category image deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.addUpdateYFCategoryFile = async (req, res) => {
  try {
    // File should be exist
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Please..upload an image!",
      });
    }
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
    // Handel file if present
    const fileStream = fs.createReadStream(req.file.path);
    await uploadFileToBunny(bunnyFolderName, fileStream, req.file.filename);
    const path = `${SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${req.file.filename}`;
    const fileName = req.file.filename;
    // delete file from resource/servere
    deleteSingleFile(req.file.path);

    let message = "uploaded";
    if (isPresent.fileName) {
      message = "updated";
      await deleteFileToBunny(bunnyFolderName, isPresent.fileName);
    }

    // update
    await isPresent.update({ fileName, path });
    // Final Response
    res.status(200).send({
      success: true,
      message: `Category image ${message} successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
