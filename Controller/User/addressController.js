const db = require("../../Models");
const { Op } = require("sequelize");
const Address = db.address;
const { validateAddress } = require("../../Middleware/Validate/validateUser");

exports.addAddress = async (req, res) => {
  try {
    // Validate Body
    const { error } = validateAddress(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const {
      email,
      phoneNumber,
      address,
      zipCode,
      city,
      country,
      latitude,
      longitude,
    } = req.body;
    const name = req.body.name.trim();
    const addressType = req.body.addressType.trim();
    const isType = await Address.findOne({ where: { addressType } });
    if (isType) {
      return res.status(400).send({
        success: false,
        message: "This address type is already present!",
      });
    }

    await Address.create({
      name,
      email,
      phoneNumber,
      address,
      zipCode,
      city,
      country,
      latitude,
      longitude,
      userId: req.user.id,
    });
    // Final response
    res.status(200).send({
      success: true,
      message: "Address added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    // Validate Body
    const { error } = validateAddress(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const {
      email,
      phoneNumber,
      address,
      zipCode,
      city,
      country,
      latitude,
      longitude,
    } = req.body;
    const name = req.body.name.trim();
    const addressType = req.body.addressType.trim();

    const id = req.params.id;
    const isAddress = await Address.findOne({ where: { id } });
    if (!isAddress) {
      return res.status(400).send({
        success: false,
        message: "This address is not present!",
      });
    }

    if (addressType !== isAddress.addressType) {
      const isType = await Address.findOne({ where: { addressType } });
      if (isType) {
        return res.status(400).send({
          success: false,
          message: "This address type is already present!",
        });
      }
    }

    await isAddress.update({
      name,
      email,
      phoneNumber,
      address,
      zipCode,
      city,
      country,
      latitude,
      longitude,
      addressType,
    });
    // Final response
    res.status(200).send({
      success: true,
      message: "Address updated successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.softDeleteAddress = async (req, res) => {
  try {
    const id = req.params.id;
    const isAddress = await Address.findOne({ where: { id } });
    if (!isAddress) {
      return res.status(400).send({
        success: false,
        message: "This address is not present!",
      });
    }

    if (req.user.isInstructor) {
      await profile.update({
        ...profile,
        deletedThrough: "Self",
      });
      await isAddress.destroy();
    } else {
      await isAddress.destroy({ force: true });
    }
    // Final response
    res.status(200).send({
      success: true,
      message: "Address deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getAddressDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const isAddress = await Address.findOne({ where: { id } });
    if (!isAddress) {
      return res.status(400).send({
        success: false,
        message: "This address is not present!",
      });
    }

    // Final response
    res.status(200).send({
      success: true,
      message: "Address details fetched successfully!",
      data: isAddress,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllAddress = async (req, res) => {
  try {
    const address = await Address.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    // Final response
    res.status(200).send({
      success: true,
      message: "Address fetched successfully!",
      data: address,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
