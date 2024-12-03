const joi = require("joi");
const pattern =
  "/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/";

exports.therapyValidation = (data) => {
  const schema = joi.object().keys({
    therapistName: joi.string().required(),
    studioLocation: joi.string().required(),
    language: joi.array().required(),
    specilization: joi.array().required(),
    instructorBio: joi.string().required(),
    latitude: joi.string().required(),
    longitude: joi.string().required(),
    pincode: joi.string().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.therapyLocationValidation = (data) => {
  const schema = joi.object().keys({
    locationName: joi.string().required(),
    latitude: joi.string().required(),
    longitude: joi.string().required(),
    radius: joi.number().required(),
    unit: joi.string().valid("km", "m").required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.therapyTimeSloteValidation = (data) => {
  const schema = joi.object().keys({
    date: joi.string().required(),
    time: joi.array().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};
