const db = require("../../Models");
const { Op } = require("sequelize");
const { deleteSingleFile } = require("../../Util/deleteFile");
const UserProfile = db.userProfile;

const { uploadFileToBunny } = require("../../Util/bunny");
const { SHOW_BUNNY_FILE_HOSTNAME } = process.env;
const fs = require("fs");
const bunnyFolderName = "u-pro-doc";

exports.addUpdateUserProfile = async (req, res) => {
  try {
    // File should be exist
    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "Please..upload profile photo!",
      });
    }
    //Upload file
    const fileStream = fs.createReadStream(req.file.path);
    await uploadFileToBunny(bunnyFolderName, fileStream, req.file.filename);
    // delete file from resource/servere
    deleteSingleFile(req.file.path);
    const profile = await UserProfile.findOne({
      where: { userId: req.user.id },
    });
    if (profile) {
      // update deletedThrough
      await profile.update({
        ...profile,
        deletedThrough: "ByUpdation",
      });
      // soft delete previos profile
      await profile.destroy();
    }
    await UserProfile.create({
      originalName: req.file.originalname,
      path: `${SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${req.file.filename}`,
      fileName: req.file.filename,
      userId: req.user.id,
    });

    // Final response
    res.status(200).send({
      success: true,
      message: "Profile pic added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    let condition = {
      id: req.params.id,
      userId: req.user.id,
    };
    let deletedThrough = "Self";
    let message = "deleted";
    if (req.admin) {
      condition = { id: req.params.id };
      deletedThrough = "Admin";
      message = "soft deleted";
    }
    const profile = await UserProfile.findOne({
      where: condition,
    });
    if (!profile) {
      return res.status(400).send({
        success: true,
        message: "Profile pic is not present!",
      });
    }
    // update deletedThrough
    await profile.update({
      ...profile,
      deletedThrough: deletedThrough,
    });
    // soft delete profile
    await profile.destroy();
    // Final response
    res.status(200).send({
      success: true,
      message: `Profile pic ${message} successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
