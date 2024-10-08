const db = require("../Models");
const { Op } = require("sequelize");
const { createNotification } = require("../Middleware/Validate/validateMaster");
const {
  changeQualificationStatus,
} = require("../Middleware/Validate/validateUser");
const CreateNotification = db.createNotification;

exports.createNotificationForAdmin = async (req, res) => {
  try {
    // Validate Body
    const { error } = createNotification(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { notification, forWhom } = req.body;
    
    await CreateNotification.create({
      notification: notification,
      forWhom: forWhom,
      creater: "Admin",
      createrId: req.admin.id,
      approvalStatusByAdmin: "Approved",
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: `Notification created successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.createNotificationForInstructor = async (req, res) => {
  try {
    // Validate Body
    const { notification } = req.body;
    if (!notification) {
      return res.status(400).send("notification should be present!");
    }
    
    await CreateNotification.create({
      notification: notification,
      forWhom: "Student",
      creater: "Instructor",
      createrId: req.user.id,
      approvalStatusByAdmin: "Pending",
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: `Notification created successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getNotificationForAdmin = async (req, res) => {
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
    if (search) {
      condition.push({
        [Op.or]: [{ notification: { [Op.substring]: search } }],
      });
    }
    // Count All notification
    const totalNotification = await CreateNotification.count({
      where: {
        [Op.and]: condition,
      },
    });
    // Get All notification
    const notification = await CreateNotification.findAll({
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
      message: `Notification fetched successfully!`,
      totalPage: Math.ceil(totalNotification / recordLimit),
      currentPage: currentPage,
      data: notification,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getNotificationForInstructor = async (req, res) => {
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
    const condition = [
      {
        [Op.or]: [{ forWhom: "Instructor" }, { forWhom: "Both" }],
      },
      {
        approvalStatusByAdmin: "Approved",
      },
    ];
    // Search
    if (search) {
      condition.push({
        [Op.or]: [{ notification: { [Op.substring]: search } }],
      });
    }
    // Count All notification
    const totalNotification = await CreateNotification.count({
      where: {
        [Op.and]: condition,
      },
    });
    // Get All notification
    const notification = await CreateNotification.findAll({
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
      message: `Notification fetched successfully!`,
      totalPage: Math.ceil(totalNotification / recordLimit),
      currentPage: currentPage,
      data: notification,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getMyNotificationForInstructor = async (req, res) => {
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
    const condition = [{ createrId: req.user.id }, { creater: "instructor" }];
    if (approvalStatusByAdmin) {
      condition.push({ approvalStatusByAdmin: approvalStatusByAdmin });
    }
    // Search
    if (search) {
      condition.push({
        [Op.or]: [{ notification: { [Op.substring]: search } }],
      });
    }
    // Count All notification
    const totalNotification = await CreateNotification.count({
      where: {
        [Op.and]: condition,
      },
    });
    // Get All notification
    const notification = await CreateNotification.findAll({
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
      message: `Notification fetched successfully!`,
      totalPage: Math.ceil(totalNotification / recordLimit),
      currentPage: currentPage,
      data: notification,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.changeNotificationStatus = async (req, res) => {
  try {
    // Validate Body
    const { error } = changeQualificationStatus(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { approvalStatusByAdmin } = req.body;
    // Find notification In Database
    const notification = await CreateNotification.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!notification) {
      return res.status(400).send({
        success: false,
        message: "This notification is not present!",
      });
    }
    // Update notification
    await notification.update({
      ...notification,
      approvalStatusByAdmin: approvalStatusByAdmin,
    });
    // Final Response
    res.status(200).send({
      success: true,
      message: `Notification ${approvalStatusByAdmin} successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
