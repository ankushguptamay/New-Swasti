const db = require("../../Models");
const User = db.user;
const UserProfile = db.userProfile;
const InstructorQualification = db.insturctorQualification;
const InstructorExperience = db.instructorExperience;
const EmailOTP = db.emailOTP;
const Chakra = db.chakra;
const IBankDetail = db.instructorBankDetails;
const IKYC = db.instructorKYC;
const ReferralHistory = db.referralHistory;
const UserWallet = db.userWallet;
const EmailCredential = db.emailCredential;
const InstructorHistory = db.instructorHistory;
const UserNotification = db.userNotification;
const Address = db.address;
const {
  instructorValidation,
  registerUserByAdmin,
  registerUserByEmail,
  loginUserByEmail,
  updateInstructor,
  verifyEmailOTP,
  loginUserByNumber,
  verifyNumberOTP,
  homeTutorTerm,
  instructorTerm,
  therapistTerm,
  yogaStudioTerm,
} = require("../../Middleware/Validate/validateUser");
const {
  USER_JWT_SECRET_KEY,
  JWT_VALIDITY,
  OTP_DIGITS_LENGTH,
  OTP_VALIDITY_IN_MILLISECONDS,
} = process.env;
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { capitalizeFirstLetter } = require("../../Util/capitalizeFirstLetter");
const generateOTP = require("../../Util/generateOTP");
const { sendEmail } = require("../../Util/sendEmail");
const { sendOTPToNumber } = require("../../Util/sendOTPToMobileNumber");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getTodayTime() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const option = {
    timeZone: timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const time = new Intl.DateTimeFormat([], option);
  return time.format(new Date());
}

function getRandomIntInclusive(max, exclude) {
  const num = Math.floor(Math.random() * max);
  return num + 1 === exclude ? getRandomInt(max) : num + 1;
}

exports.registerByEmail = async (req, res) => {
  try {
    // Validate Body
    const { error } = registerUserByEmail(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { referralCode, email, phoneNumber } = req.body;
    // Check is present
    const isUser = await User.findOne({
      paranoid: false,
      where: {
        [Op.or]: [{ email: email }, { phoneNumber: phoneNumber }],
      },
    });
    if (isUser) {
      return res.status(400).send({
        success: false,
        message: "This credentials already exist!", // Redirect to login by email page
      });
    }

    const name = capitalizeFirstLetter(req.body.name);
    const num = getRandomInt(7);
    // Create user in database
    const user = await User.create({
      email: email,
      name: name,
      phoneNumber: phoneNumber,
      referralCode: referralCode,
      chakraBreakNumber: num + 1,
    });
    // Creating Wallet
    await UserWallet.create({
      userId: user.id,
    });
    // Create Chakra
    const chakraName = [
      "Root",
      "Sacral",
      "Solar Plexus",
      "Heart",
      "Throat",
      "Third Eye",
      "Crown",
    ];
    for (let i = 0; i < chakraName.length; i++) {
      await Chakra.create({
        chakraName: chakraName[i],
        chakraNumber: i + 1,
        quantity: 0,
        ownerId: user.id,
      });
    }
    // Generate OTP for Email
    const otp = generateOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
    // Update sendEmail 0 every day
    const date = JSON.stringify(new Date());
    const todayDate = `${date.slice(1, 11)}`;
    const changeUpdateDate = await EmailCredential.findAll({
      where: { updatedAt: { [Op.lt]: todayDate } },
      order: [["createdAt", "ASC"]],
    });
    for (let i = 0; i < changeUpdateDate.length; i++) {
      // console.log("hii");
      await EmailCredential.update(
        { emailSend: 0 },
        { where: { id: changeUpdateDate[i].id } }
      );
    }
    // finalise email credentiel
    const emailCredential = await EmailCredential.findAll({
      order: [["createdAt", "ASC"]],
    });
    let finaliseEmailCredential;
    for (let i = 0; i < emailCredential.length; i++) {
      if (parseInt(emailCredential[i].emailSend) < 300) {
        finaliseEmailCredential = emailCredential[i];
        break;
      }
    }
    if (finaliseEmailCredential) {
      if (finaliseEmailCredential.plateForm === "BREVO") {
        const options = {
          brevoEmail: finaliseEmailCredential.email,
          brevoKey: finaliseEmailCredential.EMAIL_API_KEY,
          headers: { "Swasti verification OTP": "123A" },
          subject: "Registration",
          htmlContent: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verification Card</title>
                            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap">
                        <style>
                            body {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 100vh;
                                margin: 0;
                                font-family: 'Poppins', sans-serif;
                            }
                            .verification-card {
                                padding: 30px;
                                border: 1px solid #ccc;
                                box-shadow: 0 0 10px rgba(0, 0, 255, 0.1);
                                max-width: 400px;
                                width: 100%;
                                font-family: 'Poppins', sans-serif;
                            }
                            .logo-img {
                                max-width: 100px;
                                height: auto;
                            }
                            .otp-container{
                                font-size: 32px;
                                font-weight: bold;
                                text-align:center;
                                color:#1c2e4a;
                                font-family: 'Poppins', sans-serif;
                              }
                            .horizontal-line {
                                border-top: 1px solid #ccc;
                                margin: 15px 0;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="verification-card">
                            <img src="https://swasi-bharat.b-cdn.net/logo-media/swasti_bharat.png?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Logo" class="logo-img">
                            <p style='font-size:14px'>Hi <span style=" font-weight:600">${email},</span></p>
                            <p style='font-size:14px;'>Please copy the One Time Password (OTP) below and enter it in the verification page on the Swasti.</p>
                             <div class="horizontal-line"></div>
                             <p class="otp-container"> ${otp}</p>
                            <div class="horizontal-line"></div>
                            
                            <p style='font-size:14px;'>This code <span style="font-weight:600;" >expires in ${
                              parseInt(OTP_VALIDITY_IN_MILLISECONDS) / 1000 / 60
                            } minutes.</span>Please,  <span style="font-weight:600;" >DO NOT SHARE OR SEND THIS CODE TO ANYONE!</span></p>
                              <div class="horizontal-line"></div>
                        </div>
                    </body>
                    </html>`,
          userEmail: email,
          userName: name ? name : "User",
        };
        await sendEmail(options);

        const increaseNumber = parseInt(finaliseEmailCredential.emailSend) + 1;
        await EmailCredential.update(
          { emailSend: increaseNumber },
          { where: { id: finaliseEmailCredential.id } }
        );
      }
      //  Store OTP
      await EmailOTP.create({
        vallidTill:
          new Date().getTime() + parseInt(OTP_VALIDITY_IN_MILLISECONDS),
        otp: otp,
        receiverId: user.id,
      });
    }
    await UserNotification.create({
      userId: user.id,
      notification: `Welcome ${name} !
      Thank you for registering with Swasti Bharat. 
      You are now part of our vibrant community. 
      Take a moment to set up your profile and start exploring our features. 
      We are excited to support you on your journey!`,
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: `OTP send to email successfully! Valid for ${
        OTP_VALIDITY_IN_MILLISECONDS / (60 * 1000)
      } minutes!`,
      data: { email: req.body.email },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.loginByEmail = async (req, res) => {
  try {
    // Validate Body
    const { error } = loginUserByEmail(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // Check is present
    const isUser = await User.findOne({ where: { email: req.body.email } });
    if (!isUser) {
      return res.status(400).send({
        success: false,
        message: "NOTPRESENT!", // Redirect to register page, where only name and mobile number field will open
        data: { email: req.body.email },
      });
    }
    // Generate OTP for Email
    const otp = generateOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
    // Update sendEmail 0 every day
    const date = JSON.stringify(new Date());
    const todayDate = `${date.slice(1, 11)}`;
    const changeUpdateDate = await EmailCredential.findAll({
      where: { updatedAt: { [Op.lt]: todayDate } },
      order: [["createdAt", "ASC"]],
    });
    for (let i = 0; i < changeUpdateDate.length; i++) {
      await EmailCredential.update(
        { emailSend: 0 },
        { where: { id: changeUpdateDate[i].id } }
      );
    }
    // finalise email credentiel
    const emailCredential = await EmailCredential.findAll({
      order: [["createdAt", "ASC"]],
    });
    let finaliseEmailCredential;
    for (let i = 0; i < emailCredential.length; i++) {
      if (parseInt(emailCredential[i].emailSend) < 300) {
        finaliseEmailCredential = emailCredential[i];
        break;
      }
    }
    if (finaliseEmailCredential) {
      if (finaliseEmailCredential.plateForm === "BREVO") {
        const options = {
          brevoEmail: finaliseEmailCredential.email,
          brevoKey: finaliseEmailCredential.EMAIL_API_KEY,
          headers: { "Swasti verification OTP": "123A" },
          subject: "Login to swasti",
          htmlContent: `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Verification Card</title>
                            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap">
                        <style>
                            body {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                height: 100vh;
                                margin: 0;
                                font-family: 'Poppins', sans-serif;
                            }
                            .verification-card {
                                padding: 30px;
                                border: 1px solid #ccc;
                                box-shadow: 0 0 10px rgba(0, 0, 255, 0.1);
                                max-width: 400px;
                                width: 100%;
                                font-family: 'Poppins', sans-serif;
                            }
                            .logo-img {
                                max-width: 100px;
                                height: auto;
                            }
                            .otp-container{
                                font-size: 32px;
                                font-weight: bold;
                                text-align:center;
                                color:#1c2e4a;
                                font-family: 'Poppins', sans-serif;
                              }
                            .horizontal-line {
                                border-top: 1px solid #ccc;
                                margin: 15px 0;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="verification-card">
                            <img src="https://swasi-bharat.b-cdn.net/logo-media/swasti_bharat.png?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Logo" class="logo-img">
                            <p style='font-size:14px'>Hi <span style=" font-weight:600">${
                              req.body.email
                            },</span></p>
                            <p style='font-size:14px;'>Please copy the One Time Password (OTP) below and enter it in the verification page on the  Swasti.</p>
                             <div class="horizontal-line"></div>
                             <p class="otp-container"> ${otp}</p>
                            <div class="horizontal-line"></div>
                            
                            <p style='font-size:14px;'>This code <span style="font-weight:600;" >expires in ${
                              parseInt(OTP_VALIDITY_IN_MILLISECONDS) / 1000 / 60
                            } minutes.</span>Please,  <span style="font-weight:600;" >DO NOT SHARE OR SEND THIS CODE TO ANYONE!</span></p>
                              <div class="horizontal-line"></div>
                        </div>
                    </body>
                    </html>`,
          userEmail: req.body.email,
          userName: isUser.name,
        };

        await sendEmail(options);

        const increaseNumber = parseInt(finaliseEmailCredential.emailSend) + 1;
        await EmailCredential.update(
          { emailSend: increaseNumber },
          { where: { id: finaliseEmailCredential.id } }
        );
      }
      //  Store OTP
      await EmailOTP.create({
        vallidTill:
          new Date().getTime() + parseInt(OTP_VALIDITY_IN_MILLISECONDS),
        otp: otp,
        receiverId: isUser.id,
      });
    }
    // Send final success response
    res.status(200).send({
      success: true,
      message: `OTP send to email successfully! Valid for ${
        OTP_VALIDITY_IN_MILLISECONDS / (60 * 1000)
      } minutes!`,
      data: { email: req.body.email },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.verifyEmailOTP = async (req, res) => {
  try {
    // Validate body
    const { error } = verifyEmailOTP(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { email, otp } = req.body;
    // Is Email Otp exist
    const isOtp = await EmailOTP.findOne({ where: { otp: otp } });
    if (!isOtp) {
      return res.status(400).send({
        success: false,
        message: `Invalid OTP!`,
      });
    }
    // Checking is user present or not
    const user = await User.findOne({
      where: {
        [Op.and]: [{ email: email }, { id: isOtp.receiverId }],
      },
      attributes: [
        "id",
        "name",
        "phoneNumber",
        "email",
        "isInstructor",
        "userCode",
      ],
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "No Details Found. Register Now!",
      });
    }
    // is email otp expired?
    const isOtpExpired = new Date().getTime() > parseInt(isOtp.vallidTill);
    await EmailOTP.destroy({ where: { receiverId: isOtp.receiverId } });
    if (isOtpExpired) {
      return res.status(400).send({
        success: false,
        message: `OTP expired!`,
      });
    }
    // Chakra
    if (!user.isOTPVerify) {
      await user.update({ ...user, isOTPVerify: true });
      if (user.referralCode) {
        const referral = await User.findOne({
          where: { userCode: user.referralCode },
        });
        if (referral) {
          const chakraBreakNumber = parseInt(referral.chakraBreakNumber);
          const chakras = await Chakra.findAll({
            where: {
              ownerId: referral.id,
            },
            order: [["chakraNumber", "ASC"]],
          });
          let totalChakraQuantity = 0;
          for (let i = 0; i < chakras.length; i++) {
            totalChakraQuantity =
              totalChakraQuantity + parseInt(chakras[i].quantity);
          }
          let specialNum;
          if (totalChakraQuantity <= 20) {
            specialNum = getRandomIntInclusive(7, chakraBreakNumber);
          } else {
            specialNum = getRandomInt(7);
          }
          const specialChakra = await Chakra.findOne({
            where: { ownerId: referral.id, chakraNumber: parseInt(specialNum) },
          });
          const newQuantity = parseInt(specialChakra.quantity) + 1;
          await specialChakra.update({
            ...specialChakra,
            quantity: newQuantity,
          });
          const date = getTodayTime();
          await ReferralHistory.create({
            chakraNumber: specialNum,
            joinerName: user.name,
            date: date,
            joinerId: user.id,
            ownerId: referral.id,
          });
        }
      }
    }
    // generate JWT Token
    const authToken = jwt.sign(
      {
        id: user.id,
        email: email,
        phoneNumber: user.phoneNumber,
      },
      USER_JWT_SECRET_KEY,
      { expiresIn: JWT_VALIDITY } // five day
    );
    res.status(201).send({
      success: true,
      message: `Verified successfully!`,
      authToken: authToken,
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      err: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
        ],
      },
      include: [
        {
          model: InstructorQualification,
          as: "qualifications",
        },
        {
          model: Address,
          as: "address",
        },
        {
          model: UserProfile,
          as: "profilePic",
          where: { deletedThrough: null },
          attributes: ["id", "path"],
          required: false,
        },
        {
          model: InstructorExperience,
          as: "experience",
        },
      ],
      order: [
        [
          { model: InstructorQualification, as: "qualifications" },
          "createdAt",
          "DESC",
        ],
        [{ model: Address, as: "address" }, "createdAt", "DESC"],
        [
          { model: InstructorExperience, as: "experience" },
          "createdAt",
          "DESC",
        ],
      ],
    });
    let profileComplete = 0;
    let data = user;
    if (user.isInstructor) {
      if (user.name) {
        profileComplete = profileComplete + 7;
      }
      if (user.profilePic) {
        if (user.profilePic.path) {
          profileComplete = profileComplete + 2;
        }
      }
      if (user.languages) {
        profileComplete = profileComplete + 2;
      }
      if (user.bio) {
        profileComplete = profileComplete + 2;
      }
      if (user.location) {
        profileComplete = profileComplete + 2;
      }
      if (user.dateOfBirth) {
        profileComplete = profileComplete + 2;
      }
      if (user.email && user.phoneNumber) {
        profileComplete = profileComplete + 13;
      }
      const kyc = await IKYC.findOne({
        where: { instructorId: req.user.id, isVerify: true },
      });
      if (kyc) profileComplete = profileComplete + 20;
      const qualification = await InstructorQualification.findOne({
        where: { instructorId: req.user.id },
      });
      if (qualification) profileComplete = profileComplete + 30;
      const bank = await IBankDetail.findOne({
        where: { instructorId: req.user.id, isVerify: true },
      });
      if (bank) profileComplete = profileComplete + 20;

      data = { data, profileComplete };
    } else {
      data = {
        id: user.dataValues.id,
        name: user.dataValues.name,
        email: user.dataValues.email,
        phoneNumber: user.dataValues.phoneNumber,
        userCode: user.dataValues.userCode,
        createdBy: user.dataValues.createdBy,
        isInstructor: user.dataValues.isInstructor,
        isOTPVerify: user.dataValues.isOTPVerify,
        referralCode: user.dataValues.referralCode,
        createdAt: user.dataValues.createdAt,
        profilePic: user.dataValues.profilePic,
        address: user.dataValues.address,
      };
    }
    // Send final success response
    res.status(200).send({
      success: true,
      message: "Profile Fetched successfully!",
      data: data,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const { page, search, isInstructor } = req.query;
    // Pagination
    const limit = parseInt(req.query.limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * limit;
      currentPage = parseInt(page);
    }
    // Search
    const condition = [];
    if (search) {
      condition.push({
        [Op.or]: [
          { name: { [Op.substring]: search } },
          { eamil: { [Op.substring]: search } },
          { userCode: { [Op.substring]: search } },
        ],
      });
    }
    if (isInstructor == "true") {
      condition.push({ isInstructor: true });
    } else {
      condition.push({ isInstructor: false });
    }

    const count = await User.count({
      where: { [Op.and]: condition },
    });
    const user = await User.findAll({
      limit: limit,
      offset: offSet,
      where: { [Op.and]: condition },
      include: [
        {
          model: UserProfile,
          as: "profilePic",
          where: { deletedThrough: null },
          attributes: ["id", "path"],
          required: false,
        },
      ],
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: "Profile Fetched successfully!",
      totalPage: Math.ceil(count / limit),
      currentPage: currentPage,
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getInstructorForAdmin = async (req, res) => {
  try {
    const instructor = await User.findOne({
      where: { id: req.params.id, isInstructor: true },
      include: [
        {
          model: UserProfile,
          as: "profilePic",
          where: { deletedThrough: null },
          attributes: ["id", "path"],
          required: false,
        },
      ],
      paranoid: false,
    });
    if (!instructor) {
      return res.status(400).send({
        success: false,
        message: "Instructor is not present!",
      });
    }
    // Send final success response
    res.status(200).send({
      success: true,
      message: "Profile Fetched successfully!",
      data: instructor,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getUserForAdmin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.params.id,
        isInstructor: false,
      },
      include: [
        {
          model: UserProfile,
          as: "profilePic",
          where: { deletedThrough: null },
          attributes: ["id", "path"],
          required: false,
        },
      ],
      paranoid: false,
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User is not present!",
      });
    }
    // Send final success response
    res.status(200).send({
      success: true,
      message: "Profile Fetched successfully!",
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.registerUser = async (req, res) => {
  try {
    // Validate Body
    const { error } = registerUserByAdmin(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { referralCode, isInstructor } = req.body;
    // Check is present
    const isUser = await User.findOne({
      paranoid: false,
      where: { email: req.body.email },
    });
    if (isUser) {
      return res.status(400).send({
        success: false,
        message: "Credentials already present!",
      });
    }

    // generate employee code
    const today = new Date();
    today.setMinutes(today.getMinutes() + 330);
    const day = today.toISOString().slice(8, 10);
    const year = today.toISOString().slice(2, 4);
    const month = today.toISOString().slice(5, 7);

    let preCode = "SWAU";
    if (isInstructor) {
      preCode = "SWAI";
    }
    let userCode, lastDigits;
    let startWith = `${preCode}${day}${month}${year}`;
    const isUserCode = await User.findOne({
      where: { userCode: { [Op.startsWith]: startWith } },
      paranoid: false,
      order: [["createdAt", "DESC"]],
    });
    if (!isUserCode) {
      lastDigits = 1;
    } else {
      lastDigits = parseInt(isUserCode.userCode.substring(10)) + 1;
    }
    userCode = `${startWith}${lastDigits}`;
    while (await User.findOne({ where: { userCode } })) {
      userCode = `${startWith}${lastDigits++}`;
    }
    const name = capitalizeFirstLetter(req.body.name);
    const num = getRandomInt(7);
    // Create user in database
    const user = await User.create({
      ...req.body,
      name,
      userCode,
      createdBy: "Admin",
      referralCode: referralCode,
      chakraBreakNumber: num + 1,
    });
    // Creating Wallet
    await User.create({ userId: user.id });
    // Create Chakra
    const chakraName = [
      "Root",
      "Sacral",
      "Solar Plexus",
      "Heart",
      "Throat",
      "Third Eye",
      "Crown",
    ];
    for (let i = 0; i < chakraName.length; i++) {
      await Chakra.create({
        chakraName: chakraName[i],
        chakraNumber: i + 1,
        quantity: 0,
        ownerId: user.id,
      });
    }

    await UserNotification.create({
      userId: user.id,
      notification: `Welcome ${name} !
      Thank you for registering with Swasti Bharat. 
      You are now part of our vibrant community. 
      Take a moment to set up your profile and start exploring our features. 
      We are excited to support you on your journey!`,
    });

    // Email or SMS to Insturctor
    // Send final success response
    res.status(200).send({
      success: true,
      message: "User Registered successfully!",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.softDeleteUser = async (req, res) => {
  try {
    // Check perticular user present in database
    const user = await User.findOne({
      where: { id: req.params.id },
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User is not present!",
      });
    }
    // soft delete
    await user.destroy();
    // Send final success response
    res.status(200).send({
      success: true,
      message: `User Profile [${user.userCode}] soft deleted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.restoreUser = async (req, res) => {
  try {
    // Check perticular user present in database
    const user = await User.findOne({
      paranoid: false,
      where: {
        id: req.params.id,
        deletedAt: { [Op.ne]: null },
      },
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User is not present in soft delete!",
      });
    }
    // restore
    await user.restore();
    // Send final success response
    res.status(200).send({
      success: true,
      message: `User Profile [${user.userCode}] restored successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllSoftDeletedUser = async (req, res) => {
  try {
    const { page, search, isInstructor } = req.query;
    // Pagination
    const limit = parseInt(req.query.limit) || 10;
    let offSet = 0;
    let currentPage = 1;
    if (page) {
      offSet = (parseInt(page) - 1) * limit;
      currentPage = parseInt(page);
    }
    // Search
    const condition = [{ deletedAt: { [Op.ne]: null } }];
    if (search) {
      condition.push({
        [Op.or]: [
          { name: { [Op.substring]: search } },
          { eamil: { [Op.substring]: search } },
          { userCode: { [Op.substring]: search } },
        ],
      });
    }

    if (isInstructor == "true") {
      condition.push({ isInstructor: true });
    } else {
      condition.push({ isInstructor: false });
    }

    const count = await User.count({
      where: { [Op.and]: condition },
      paranoid: false,
    });
    const user = await User.findAll({
      limit: limit,
      offset: offSet,
      where: { [Op.and]: condition },
      include: [
        {
          model: UserProfile,
          as: "profilePic",
          where: { deletedThrough: null },
          attributes: ["id", "path"],
          required: false,
        },
      ],
      paranoid: false,
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: "Deleted User's Profile Fetched successfully!",
      totalPage: Math.ceil(count / limit),
      currentPage: currentPage,
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updateInstructor = async (req, res) => {
  try {
    // Validate Body
    const { error } = updateInstructor(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // Check perticular instructor present in database
    const instructor = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
          { isInstructor: true },
        ],
      },
    });
    if (!instructor) {
      return res.status(400).send({
        success: false,
        message: "Instructor is not present!",
      });
    }
    const {
      bio,
      socialMediaLink,
      twitter_x,
      facebook,
      instagram,
      linkedIn,
      languages,
      dateOfBirth,
    } = req.body;
    const name = capitalizeFirstLetter(req.body.name);
    // store current data in history
    await InstructorHistory.create({
      name: instructor.name,
      email: instructor.email,
      phoneNumber: instructor.phoneNumber,
      instructorType: instructor.instructorType,
      bio: instructor.bio,
      socialMediaLink: instructor.socialMediaLink,
      instructorId: req.user.id,
      twitter_x: instructor.twitter_x,
      facebook: instructor.facebook,
      instagram: instructor.instagram,
      linkedIn: instructor.linkedIn,
      languages: instructor.languages,
      dateOfBirth: instructor.dateOfBirth,
    });
    // Update
    await instructor.update({
      name: name,
      bio: bio,
      socialMediaLink: socialMediaLink,
      twitter_x: twitter_x,
      facebook: facebook,
      instagram: instagram,
      linkedIn: linkedIn,
      languages: languages,
      dateOfBirth: dateOfBirth,
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: `Profile updated successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.registerByNumber = async (req, res) => {
  try {
    // Validate Body
    const { error } = registerUserByEmail(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { referralCode } = req.body;
    // Check is present
    const isUser = await User.findOne({
      paranoid: false,
      where: {
        [Op.or]: [
          { email: req.body.email },
          { phoneNumber: req.body.phoneNumber },
        ],
      },
    });
    if (isUser) {
      return res.status(400).send({
        success: false,
        message: "This credentials already exist!!", // Redirect to login by phone number page
      });
    }

    const name = capitalizeFirstLetter(req.body.name);
    const num = getRandomInt(7);

    // Create user in database
    const user = await User.create({
      email: req.body.email,
      name: name,
      phoneNumber: req.body.phoneNumber,
      referralCode,
      chakraBreakNumber: num + 1,
    });
    // Creating Wallet
    await UserWallet.create({ userId: user.id });
    // Create Chakra
    const chakraName = [
      "Root",
      "Sacral",
      "Solar Plexus",
      "Heart",
      "Throat",
      "Third Eye",
      "Crown",
    ];
    for (let i = 0; i < chakraName.length; i++) {
      await Chakra.create({
        chakraName: chakraName[i],
        chakraNumber: i + 1,
        quantity: 0,
        ownerId: user.id,
      });
    }
    // Generate OTP for Email
    const otp = generateOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
    // Sending OTP to mobile number
    await sendOTPToNumber(req.body.phoneNumber, otp);
    //  Store OTP
    await EmailOTP.create({
      vallidTill: new Date().getTime() + parseInt(OTP_VALIDITY_IN_MILLISECONDS),
      otp: otp,
      receiverId: user.id,
    });
    await UserNotification.create({
      userId: user.id,
      notification: `Welcome ${name} !
      Thank you for registering with Swasti Bharat. 
      You are now part of our vibrant community. 
      Take a moment to set up your profile and start exploring our features. 
      We are excited to support you on your journey!`,
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: `Registerd successfully!`,
      data: { phoneNumber: req.body.phoneNumber },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.loginByNumber = async (req, res) => {
  try {
    // Validate Body
    const { error } = loginUserByNumber(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    // Check is present
    const isUser = await User.findOne({
      where: { phoneNumber: req.body.phoneNumber },
    });
    if (!isUser) {
      return res.status(400).send({
        success: false,
        message: "NOTPRESENT!", // Redirect to register page, where only name and email field will open
        data: { phoneNumber: req.body.phoneNumber },
      });
    }
    // Generate OTP for Email
    const otp = generateOTP.generateFixedLengthRandomNumber(OTP_DIGITS_LENGTH);
    // Sending OTP to mobile number
    await sendOTPToNumber(req.body.phoneNumber, otp);
    //  Store OTP
    await EmailOTP.create({
      vallidTill: new Date().getTime() + parseInt(OTP_VALIDITY_IN_MILLISECONDS),
      otp: otp,
      receiverId: isUser.id,
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: `OTP send successfully! Valid for ${
        OTP_VALIDITY_IN_MILLISECONDS / (60 * 1000)
      } minutes!`,
      data: { phoneNumber: req.body.phoneNumber },
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.verifyNumberOTP = async (req, res) => {
  try {
    // Validate body
    const { error } = verifyNumberOTP(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { phoneNumber, otp } = req.body;
    // Is Email Otp exist
    const isOtp = await EmailOTP.findOne({
      where: { otp: otp },
    });
    if (!isOtp) {
      return res.status(400).send({
        success: false,
        message: `Invalid OTP!`,
      });
    }
    // Checking is user present or not
    const user = await User.findOne({
      where: {
        [Op.and]: [{ phoneNumber: phoneNumber }, { id: isOtp.receiverId }],
      },
      attributes: [
        "id",
        "name",
        "phoneNumber",
        "email",
        "isInstructor",
        "userCode",
      ],
    });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "No Details Found. Register Now!",
      });
    }
    // is email otp expired?
    const isOtpExpired = new Date().getTime() > parseInt(isOtp.vallidTill);
    await EmailOTP.destroy({ where: { receiverId: isOtp.receiverId } });
    if (isOtpExpired) {
      return res.status(400).send({
        success: false,
        message: `OTP expired!`,
      });
    }
    // Chakra
    if (!user.isOTPVerify) {
      await user.update({ ...user, isOTPVerify: true });
      if (user.referralCode) {
        const referral = await User.findOne({
          where: { userCode: user.referralCode },
        });
        if (referral) {
          const chakraBreakNumber = parseInt(referral.chakraBreakNumber);
          const chakras = await Chakra.findAll({
            where: { ownerId: referral.id },
            order: [["chakraNumber", "ASC"]],
          });
          let totalChakraQuantity = 0;
          for (let i = 0; i < chakras.length; i++) {
            totalChakraQuantity =
              totalChakraQuantity + parseInt(chakras[i].quantity);
          }
          let specialNum;
          if (totalChakraQuantity <= 20) {
            specialNum = getRandomIntInclusive(7, chakraBreakNumber);
          } else {
            specialNum = getRandomInt(7);
          }
          const specialChakra = await Chakra.findOne({
            where: { ownerId: referral.id, chakraNumber: parseInt(specialNum) },
          });
          const newQuantity = parseInt(specialChakra.quantity) + 1;
          await specialChakra.update({
            ...specialChakra,
            quantity: newQuantity,
          });
          const date = getTodayTime();
          await ReferralHistory.create({
            chakraNumber: specialNum,
            joinerName: user.name,
            date: date,
            joinerId: user.id,
            ownerId: referral.id,
          });
        }
      }
    }
    // generate JWT Token
    const authToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        phoneNumber: phoneNumber,
      },
      USER_JWT_SECRET_KEY,
      { expiresIn: JWT_VALIDITY } // five day
    );
    res.status(201).send({
      success: true,
      message: `Verified successfully!`,
      authToken: authToken,
      data: user,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      err: err.message,
    });
  }
};

exports.instructorTerm = async (req, res) => {
  try {
    // Validate body
    const { error } = instructorTerm(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { instructorTermAccepted } = req.body;
    // Check perticular instructor present in database
    const instructor = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
          { isInstructor: true },
        ],
      },
    });
    if (!instructor) {
      return res.status(400).send({
        success: false,
        message: "Instructor is not present!",
      });
    }
    // Update
    await instructor.update({
      ...instructor,
      instructorTermAccepted: instructorTermAccepted,
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: `Instructor term accepted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.homeTutorTerm = async (req, res) => {
  try {
    // Validate body
    const { error } = homeTutorTerm(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { homeTutorTermAccepted } = req.body;
    // Check perticular instructor present in database
    const instructor = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
          { isInstructor: true },
        ],
      },
    });
    if (!instructor) {
      return res.status(400).send({
        success: false,
        message: "Instructor is not present!",
      });
    }
    // Update
    await instructor.update({
      ...instructor,
      homeTutorTermAccepted: homeTutorTermAccepted,
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: `Home tutor term accepted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.therapistTerm = async (req, res) => {
  try {
    // Validate body
    const { error } = therapistTerm(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { therapistTermAccepted } = req.body;
    // Check perticular instructor present in database
    const instructor = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
          { isInstructor: true },
        ],
      },
    });
    if (!instructor) {
      return res.status(400).send({
        success: false,
        message: "Instructor is not present!",
      });
    }
    // Update
    await instructor.update({
      ...instructor,
      therapistTermAccepted: therapistTermAccepted,
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: `Therapist term accepted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.yogaStudioTerm = async (req, res) => {
  try {
    // Validate body
    const { error } = yogaStudioTerm(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { yogaStudioTermAccepted } = req.body;
    // Check perticular instructor present in database
    const instructor = await User.findOne({
      where: {
        [Op.and]: [
          { id: req.user.id },
          { email: req.user.email },
          { phoneNumber: req.user.phoneNumber },
          { isInstructor: true },
        ],
      },
    });
    if (!instructor) {
      return res.status(400).send({
        success: false,
        message: "Instructor is not present!",
      });
    }
    // Update
    await instructor.update({
      ...instructor,
      yogaStudioTermAccepted: yogaStudioTermAccepted,
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: `Yoga studio term accepted successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getMyChakra = async (req, res) => {
  try {
    const chakra = await Chakra.findAll({
      where: { ownerId: req.user.id },
      order: [["chakraNumber", "ASC"]],
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: `Chakra fetched successfully!`,
      data: chakra,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getReferralData = async (req, res) => {
  try {
    const referral = await ReferralHistory.findAll({
      where: { ownerId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    // Send final success response
    res.status(200).send({
      success: true,
      message: `Referral data fetched successfully!`,
      data: referral,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

exports.isInstructorPage = async (req, res) => {
  try {
    // Validate Body
    const { error } = instructorValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { isInstructor } = req.body;
    const id = req.user.id;
    // Check is present
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "NOTPRESENT!",
      });
    }
    // generate employee code
    const today = new Date();
    today.setMinutes(today.getMinutes() + 330);
    const day = today.toISOString().slice(8, 10);
    const year = today.toISOString().slice(2, 4);
    const month = today.toISOString().slice(5, 7);

    let preCode = "SWAU";
    if (isInstructor) {
      preCode = "SWAI";
    }
    let userCode, lastDigits;
    let startWith = `${preCode}${day}${month}${year}`;
    const isUserCode = await User.findOne({
      where: { userCode: { [Op.startsWith]: startWith } },
      paranoid: false,
      order: [["createdAt", "DESC"]],
    });
    if (!isUserCode) {
      lastDigits = 1;
    } else {
      lastDigits = parseInt(isUserCode.userCode.substring(10)) + 1;
    }
    userCode = `${startWith}${lastDigits}`;
    while (await User.findOne({ where: { userCode } })) {
      userCode = `${startWith}${lastDigits++}`;
    }

    // Create user in database
    await user.update({ ...user, isInstructor, userCode });

    // Send final success response
    res.status(200).send({
      success: true,
      message: `Welcome to SWASTI!`,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
