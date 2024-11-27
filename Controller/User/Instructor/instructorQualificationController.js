const db = require("../../../Models");
const { Op } = require("sequelize");
const {
  addQualification,
  changeQualificationStatus,
} = require("../../../Middleware/Validate/validateUser");
const { deleteSingleFile } = require("../../../Util/deleteFile");
const InstructorQualification = db.insturctorQualification;
const Instructor = db.user;
const { SHOW_BUNNY_FILE_HOSTNAME } = process.env;
const { uploadFileToBunny, deleteFileToBunny } = require("../../../Util/bunny");
const fs = require("fs");
const bunnyFolderName = "inst-doc";

exports.addQualification = async (req, res) => {
  try {
    // Validate Body
    const { error } = addQualification(req.body);
    if (error) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).send(error.details[0].message);
    }
    const {
      courseType,
      course,
      university_name,
      institute_collage,
      year,
      marksType,
      marks,
      certificationNumber,
      qualificationIn,
    } = req.body;
    //Upload file
    const isQualification = await InstructorQualification.findOne({
      where: { course: course, instructorId: req.user.id },
    });
    if (isQualification) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).send({
        success: false,
        message: "This qualification already exists!",
      });
    }

    let originalname, filename, path;
    if (req.file) {
      const fileStream = fs.createReadStream(req.file.path);
      await uploadFileToBunny(bunnyFolderName, fileStream, req.file.filename);
      originalname = req.file.originalname;
      filename = req.file.filename;
      path = `${SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${req.file.filename}`;
      // delete file from resource/servere
      deleteSingleFile(req.file.path);
    }
    // Find in database
    await InstructorQualification.create({
      courseType: courseType,
      course: course,
      university_name: university_name,
      institute_collage: institute_collage,
      year: year,
      marksType: marksType,
      marks: marks,
      certificationNumber: certificationNumber,
      qualificationIn: qualificationIn,
      documentOriginalName: originalname,
      documentPath: path,
      documentFileName: filename,
      instructorId: req.user.id,
      approvalStatusByAdmin: "Pending",
    });
    // Final response
    res.status(200).send({
      success: true,
      message: "Qualification added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.changeQualificationStatus = async (req, res) => {
  try {
    // Validate Body
    const { error } = changeQualificationStatus(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { approvalStatusByAdmin } = req.body;
    const qualification = await InstructorQualification.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!qualification) {
      return res.status(400).send({
        success: true,
        message: "This qualification is not present!",
      });
    }
    if (approvalStatusByAdmin === "Approved") {
      await Instructor.update(
        { isVerify: true },
        { where: { id: qualification.instructorId } }
      );
    }
    await qualification.update({
      ...qualification,
      approvalStatusByAdmin: approvalStatusByAdmin,
    });
    // Final response
    res.status(200).send({
      success: true,
      message: `Qualification status '${approvalStatusByAdmin}' changed successfully`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.softDeleteQualificationAdmin = async (req, res) => {
  try {
    const qualification = await InstructorQualification.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!qualification) {
      return res.status(400).send({
        success: true,
        message: "This qualification is not present!",
      });
    }
    await qualification.update({ ...qualification, deletedThrough: "Admin" });
    await qualification.destroy();
    // Final response
    res.status(200).send({
      success: true,
      message: "Qualification soft deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.restoreQualificationAdmin = async (req, res) => {
  try {
    const qualification = await InstructorQualification.findOne({
      paranoid: false,
      where: {
        id: req.params.id,
        deletedAt: { [Op.ne]: null },
      },
    });
    if (!qualification) {
      return res.status(400).send({
        success: true,
        message: "This qualification is not present!",
      });
    }
    if (
      qualification.deletedThrough === "Instructor" ||
      qualification.deletedThrough === "ByUpdation"
    ) {
      return res.status(400).send({
        success: true,
        message: "Warning! This qualification is not deleted by Swasti!",
      });
    }
    await qualification.update({ ...qualification, deletedThrough: null });
    // Restore
    await qualification.restore();
    // Final response
    res.status(200).send({
      success: true,
      message: "Qualification restored successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateQualification = async (req, res) => {
  try {
    // Validate Body
    const { error } = addQualification(req.body);
    if (error) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).send(error.details[0].message);
    }
    const {
      courseType,
      course,
      university_name,
      institute_collage,
      year,
      marksType,
      marks,
      certificationNumber,
      qualificationIn,
    } = req.body;
    // Find in database
    const qualification = await InstructorQualification.findOne({
      where: {
        id: req.params.id,
        instructorId: req.user.id,
      },
    });
    if (!qualification) {
      if (req.file) {
        deleteSingleFile(req.file.path);
      }
      return res.status(400).send({
        success: true,
        message: "This qualification is not present!",
      });
    }
    //Upload file
    let documentPath = qualification.documentPath,
      documentOriginalName = qualification.documentOriginalName,
      documentFileName = qualification.documentFileName;
    if (req.file) {
      const fileStream = fs.createReadStream(req.file.path);
      await uploadFileToBunny(bunnyFolderName, fileStream, req.file.filename);
      documentFileName = req.file.filename;
      documentOriginalName = req.file.originalname;
      documentPath = `${SHOW_BUNNY_FILE_HOSTNAME}/${bunnyFolderName}/${req.file.filename}`;
      // delete file from resource/servere
      deleteSingleFile(req.file.path);
    }
    if (qualification.approvalStatusByAdmin === "Pending") {
      if (req.file) {
        await deleteFileToBunny(
          bunnyFolderName,
          qualification.documentFileName
        );
      }
      await qualification.update({
        ...qualification,
        courseType: courseType,
        qualificationIn: qualificationIn,
        course: course,
        university_name: university_name,
        institute_collage: institute_collage,
        year: year,
        marksType: marksType,
        marks: marks,
        certificationNumber: certificationNumber,
        documentOriginalName: documentOriginalName,
        documentPath: documentPath,
        documentFileName: documentFileName,
      });
    } else {
      await InstructorQualification.create({
        courseType: courseType,
        qualificationIn: qualificationIn,
        course: course,
        university_name: university_name,
        institute_collage: institute_collage,
        year: year,
        marksType: marksType,
        marks: marks,
        certificationNumber: certificationNumber,
        documentOriginalName: documentOriginalName,
        documentPath: documentPath,
        documentFileName: documentFileName,
        instructorId: req.user.id,
        createdAt: qualification.createdAt,
        approvalStatusByAdmin: "Pending",
      });

      await qualification.update({
        ...qualification,
        deletedThrough: "ByUpdation",
      });
      // soft delete
      await qualification.destroy();
    }
    // Final response
    res.status(200).send({
      success: true,
      message: "Qualification updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

// Soft Delete
exports.deleteQualificationInstructor = async (req, res) => {
  try {
    const qualification = await InstructorQualification.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!qualification) {
      return res.status(400).send({
        success: true,
        message: "This qualification is not present!",
      });
    }
    if (qualification.approvalStatusByAdmin === "Pending") {
      if (qualification.documentFileName) {
        await deleteFileToBunny(
          bunnyFolderName,
          qualification.documentFileName
        );
      }
      // Soft Delete
      await qualification.destroy({ force: true });
    } else {
      await qualification.update({
        ...qualification,
        deletedThrough: "Instructor",
      });
      // Soft Delete
      await qualification.destroy();
    }
    // Final response
    res.status(200).send({
      success: true,
      message: "Qualification deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getQualificationById = async (req, res) => {
  try {
    let argument = {
      where: {
        id: req.params.id,
      },
    };
    if (req.admin) {
      argument = {
        where: {
          id: req.params.id,
        },
        paranoid: false,
      };
    }
    const qualification = await InstructorQualification.findOne(argument);
    if (!qualification) {
      return res.status(400).send({
        success: false,
        message: "This qualification is not present!",
      });
    }
    // Final response
    res.status(200).send({
      success: true,
      message: "Qualification fetched successfully!",
      data: qualification,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getSoftDeletedQualification = async (req, res) => {
  try {
    const argument = {
      where: {
        instructorId: req.params.id,
        deletedAt: { [Op.ne]: null },
      },
      paranoid: false,
    };
    const qualification = await InstructorQualification.findAll(argument);
    // Final response
    res.status(200).send({
      success: true,
      message: "Soft deleted qualification fetched successfully!",
      data: qualification,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getMyQualificationByqualificationIn = async (req, res) => {
  try {
    const qualificationIn = req.params.qualificationIn;
    const argument = {
      where: {
        instructorId: req.user.id,
        qualificationIn: qualificationIn,
      },
    };
    const qualification = await InstructorQualification.findAll(argument);
    // Final response
    res.status(200).send({
      success: true,
      message: `${qualificationIn} qualification fetched successfully!`,
      data: qualification,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
