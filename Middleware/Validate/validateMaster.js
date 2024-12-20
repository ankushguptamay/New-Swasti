const joi = require("joi");

exports.courseCategoryValidation = (data) => {
  const schema = joi.object().keys({
    categoryName: joi.string().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.yogaForCategoryValidation = (data) => {
  const schema = joi.object().keys({
    yogaFor: joi.string().required(),
    description: joi.string().min(20).max(1000).optional(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.courseCouponValidation = (data) => {
  const schema = joi.object().keys({
    couponTitle: joi.string().required(),
    discountInPercent: joi.string().required(),
    validTill: joi.string().required(),
    couponFor: joi.string().valid("Course", "HomeTutor", "Theray").required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.createNotification = (data) => {
  const schema = joi.object().keys({
    notification: joi.string().max(1000).required(),
    forWhom: joi.string().valid("Student", "Instructor", "Both").required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.courseDurationValidation = (data) => {
  const schema = joi.object().keys({
    courseDuration: joi.string().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.courseTypeValidation = (data) => {
  const schema = joi.object().keys({
    courseType: joi.string().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.courseDurationTypeValidation = (data) => {
  const schema = joi.object().keys({
    courseDuration: joi.string().required(),
    courseType: joi.string().required(),
    courseName: joi.string().required(),
    universityId: joi.string().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.university_instituteValidation = (data) => {
  const schema = joi.object().keys({
    university_name: joi.string().required(),
    institute_collage: joi.string().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.sendCampaignEmail = (data) => {
  const schema = joi.object().keys({
    users: joi.array().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.addCampaignEmailCredentials = (data) => {
  const schema = joi.object().keys({
    email: joi.string().email().required().label("Email"),
    apiKey: joi.string().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.therapySpecilizationValidation = (data) => {
  const schema = joi.object().keys({
    specilization: joi.string().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.therapyTypeValidation = (data) => {
  const schema = joi.object().keys({
    therapyType: joi.string().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.skillValidation = (data) => {
  const schema = joi.object().keys({
    skill: joi.string().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};