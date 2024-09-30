const db = require("../../../Models");
const IBankDetail = db.instructorBankDetails;
const IKYC = db.instructorKYC;
const {
  addBankDetails,
  addKYC,
} = require("../../../Middleware/Validate/validateUser");

exports.addBankDetails = async (req, res) => {
  try {
    // Validate Body
    const { error } = addBankDetails(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { bankName, accountNumber, name, IFSCCode, isVerify } = req.body;
    if (!isVerify) {
      return res.status(400).send({
        success: false,
        message: `Bank detail should be verified!`,
      });
    }

    const isPresent = await IBankDetail.findOne({
      where: { accountNumber: accountNumber },
    });
    if (isPresent) {
      return res.status(400).send({
        success: false,
        message: `This account number is present!`,
      });
    }

    await IBankDetail.create({
      bankName: bankName,
      name: name,
      IFSCCode: IFSCCode,
      accountNumber: accountNumber,
      isVerify: isVerify,
      instructorId: req.user.id,
    });
    // Final response
    res.status(200).send({
      success: true,
      message: `Bank details added successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getBankDetails = async (req, res) => {
  try {
    const details = await IBankDetail.findAll({
      where: { instructorId: req.user.id },
    });
    // Final response
    res.status(200).send({
      success: true,
      message: `Bank details fetched successfully!`,
      data: details,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.addKYC = async (req, res) => {
  try {
    // Validate Body
    const { error } = addKYC(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { aadharNumber, address, name, isVerify } = req.body;
    if (!isVerify) {
      return res.status(400).send({
        success: false,
        message: `KYC should be verified!`,
      });
    }

    const isKYC = await IKYC.findOne({ where: { aadharNumber } });
    if (isKYC) {
      return res.status(400).send({
        success: false,
        message: `Aadhar Number is present!`,
      });
    }

    await IKYC.create({
      name: name,
      aadharNumber: aadharNumber,
      address: address,
      isVerify: isVerify,
      instructorId: req.user.id,
    });
    // Final response
    res.status(200).send({
      success: true,
      message: `KYC added successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getKYC = async (req, res) => {
  try {
    const kyc = await IKYC.findOne({
      where: { instructorId: req.user.id },
    });
    // Final response
    res.status(200).send({
      success: true,
      message: `KYC fetched successfully!`,
      data: kyc,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteKYC = async (req, res) => {
  try {
    const kyc = await IKYC.findOne({
      where: { id: req.params.id },
    });
    if (!kyc) {
      return res.status(400).send({
        success: false,
        message: `KYC is not present!`,
      });
    }
    await kyc.destroy();
    // Final response
    res.status(200).send({
      success: true,
      message: `KYC deleted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteBankDetails = async (req, res) => {
  try {
    const details = await IBankDetail.findOne({
      where: { id: req.params.id },
    });
    if (!details) {
      return res.status(400).send({
        success: false,
        message: `Bank detail is not present!`,
      });
    }
    await details.destroy();
    // Final response
    res.status(200).send({
      success: true,
      message: `Bank detail deleted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateKYC = async (req, res) => {
  try {
    // Validate Body
    const { error } = addKYC(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { aadharNumber, address, name, isVerify } = req.body;
    const kyc = await IKYC.findOne({
      where: { id: req.params.id },
    });
    if (!kyc) {
      return res.status(400).send({
        success: false,
        message: `KYC is not present!`,
      });
    }
    if (!isVerify) {
      return res.status(400).send({
        success: false,
        message: `KYC should be verified!`,
      });
    }

    if (kyc.aadharNumber !== aadharNumber) {
      const isKYC = await IKYC.findOne({ where: { aadharNumber } });
      if (isKYC) {
        return res.status(400).send({
          success: false,
          message: `Aadhar Number is present!`,
        });
      }
    }

    await kyc.update({
      name: name,
      aadharNumber: aadharNumber,
      address: address,
      isVerify: isVerify,
    });
    // Final response
    res.status(200).send({
      success: true,
      message: `KYC updated successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateBankDetails = async (req, res) => {
  try {
    // Validate Body
    const { error } = addBankDetails(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { bankName, accountNumber, name, IFSCCode, isVerify } = req.body;
    const details = await IBankDetail.findOne({
      where: { id: req.params.id },
    });
    if (!details) {
      return res.status(400).send({
        success: false,
        message: `Bank detail is not present!`,
      });
    }
    if (!isVerify) {
      return res.status(400).send({
        success: false,
        message: `Bank detail should be verified!`,
      });
    }
    await details.update({
      ...details,
      bankName: bankName,
      name: name,
      IFSCCode: IFSCCode,
      accountNumber: accountNumber,
      isVerify: isVerify,
    });
    // Final response
    res.status(200).send({
      success: true,
      message: `Bank detail updated successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
