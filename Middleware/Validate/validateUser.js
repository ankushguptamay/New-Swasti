const joi = require("joi");
const pattern =
  "/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/";

exports.loginUserByEmail = (data) => {
  const schema = joi.object().keys({
    email: joi.string().email().required().label("Email"),
    referralCode: joi.string().optional(),
  });
  return schema.validate(data);
};

exports.loginUserByNumber = (data) => {
  const schema = joi.object().keys({
    phoneNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    referralCode: joi.string().optional(),
  });
  return schema.validate(data);
};

exports.validateAddress = (data) => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required().label("Email"),
    phoneNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    address: joi.string().min(3).max(200).required(),
    zipCode: joi.string().length(6).required(),
    city: joi.string().required(),
    country: joi.string().required(),
    latitude: joi.string().required(),
    longitude: joi.string().required(),
    addressType: joi.string().required(),
  });
  return schema.validate(data);
};

exports.registerUserByEmail = (data) => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required().label("Email"),
    phoneNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    referralCode: joi.string().optional(),
  });
  return schema.validate(data);
};

exports.instructorValidation = (data) => {
  const schema = joi.object().keys({
    isInstructor: joi.boolean().required(),
  });
  return schema.validate(data);
};

exports.registerUserByAdmin = (data) => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required().label("Email"),
    phoneNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    referralCode: joi.string().optional(),
    isInstructor: joi.boolean().required(),
  });
  return schema.validate(data);
};

exports.updateInstructor = (data) => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(30).required(),
    bio: joi.string().max(1000).required(),
    socialMediaLink: joi.string().optional(),
    facebook: joi.string().optional(),
    instagram: joi.string().optional(),
    linkedIn: joi.string().optional(),
    twitter_x: joi.string().optional(),
    languages: joi.array().required(),
    dateOfBirth: joi.string().required(),
    totalExperienceInYears: joi.number().required(),
  }); //.options({ allowUnknown: true });
  return schema.validate(data);
};

exports.addQualification = (data) => {
  const schema = joi.object().keys({
    courseType: joi.string().required(),
    course: joi.string().required(),
    university_name: joi.string().required(),
    institute_collage: joi.string().required(),
    year: joi.string().required(),
    marksType: joi.string().optional(),
    marks: joi.string().optional(),
    certificationNumber: joi.string().required(),
    qualificationIn: joi
      .string()
      .valid("YogaStudio", "HomeTutor", "Therapy")
      .required(),
  }); //.options({ allowUnknown: true });
  return schema.validate(data);
};

exports.verifyEmailOTP = (data) => {
  const schema = joi.object().keys({
    email: joi.string().email().required().label("Email"),
    otp: joi.string().length(6).required(),
  });
  return schema.validate(data);
};

exports.verifyNumberOTP = (data) => {
  const schema = joi.object().keys({
    phoneNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    otp: joi.string().length(6).required(),
  });
  return schema.validate(data);
};

exports.therapistTerm = (data) => {
  const schema = joi.object().keys({
    therapistTermAccepted: joi.boolean().required(),
  });
  return schema.validate(data);
};

exports.homeTutorTerm = (data) => {
  const schema = joi.object().keys({
    homeTutorTermAccepted: joi.boolean().required(),
  });
  return schema.validate(data);
};

exports.instructorTerm = (data) => {
  const schema = joi.object().keys({
    instructorTermAccepted: joi.boolean().required(),
  });
  return schema.validate(data);
};

exports.yogaStudioTerm = (data) => {
  const schema = joi.object().keys({
    yogaStudioTermAccepted: joi.boolean().required(),
  });
  return schema.validate(data);
};

exports.changeQualificationStatus = (data) => {
  const schema = joi.object().keys({
    approvalStatusByAdmin: joi
      .string()
      .valid("Approved", "Rejected")
      .required(),
  });
  return schema.validate(data);
};

exports.addExperience = (data) => {
  const schema = joi.object().keys({
    skills: joi.array().required(),
    workHistory: joi.string().required(),
    role: joi.string().required(),
    organization: joi.string().required(),
    joinDate: joi.string().required(),
    department: joi.string().required(),
  }); //.options({ allowUnknown: true });
  return schema.validate(data);
};

exports.changeHTTimeSloteStatus = (data) => {
  const schema = joi.object().keys({
    appointmentStatus: joi.string().valid("Active", "Deactivate").required(),
    password: joi.string().length(6).optional(),
  });
  return schema.validate(data);
};

exports.addBankDetails = (data) => {
  const schema = joi.object().keys({
    accountNumber: joi.string().required(),
    bankName: joi.string().required(),
    name: joi.string().required(),
    IFSCCode: joi.string().required(),
    isVerify: joi.boolean().valid().required(),
  });
  return schema.validate(data);
};

exports.addKYC = (data) => {
  const schema = joi.object().keys({
    aadharNumber: joi.string().required(),
    address: joi.string().required(),
    name: joi.string().required(),
    isVerify: joi.boolean().required(),
  });
  return schema.validate(data);
};
