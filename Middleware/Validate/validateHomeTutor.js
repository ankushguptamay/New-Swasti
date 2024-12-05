const joi = require("joi");
const pattern =
  "/(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[$@$!#.])[A-Za-zd$@$!%*?&.]{8,20}/";

exports.homeTutorValidation = (data) => {
  const schema = joi.object().keys({
    yogaFor: joi.array().required(),
    homeTutorName: joi.string().required(),
    isPrivateSO: joi.boolean().required(),
    isGroupSO: joi.boolean().required(),
    language: joi.array().required(),
    specilization: joi.array().required(),
    instructorBio: joi.string().required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.hTutorLocationValidation = (data) => {
  const schema = joi.object().keys({
    locationName: joi.string().required(),
    latitude: joi.string().required(),
    longitude: joi.string().required(),
    radius: joi.number().required(),
    unit: joi.string().valid("km", "m").required(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.hTutorTimeSloteValidation = (data) => {
  const schema = joi.object().keys({
    isOnline: joi.boolean().required(),
    startTime: joi.string().required(),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
    timeDurationInMin: joi.number().required(),
    serviceType: joi.string().valid("Group", "Private").required(),
    serviceAreaId: joi.string().optional(),
    newServiceArea: joi.object().optional(),
    availableSeat: joi.number().required(),
    priceId: joi.string().optional(),
    newPrice: joi
      .object({
        arg: joi
          .string()
          .valid(
            "priceName",
            "durationType",
            "private_PricePerDayPerRerson",
            "private_totalPricePerPerson",
            "group_PricePerDayPerRerson",
            "group_totalPricePerPerson"
          ),
        value: joi.string(),
      })
      .pattern(/priceName/, joi.string().required())
      .pattern(
        /durationType/,
        joi
          .string()
          .valid("monthly 25", "weekly 6", "monthly 30", "weekly 7", "daily")
          .required()
      )
      .pattern(/private_PricePerDayPerRerson/, joi.string())
      .pattern(/group_PricePerDayPerRerson/, joi.string())
      .pattern(/private_totalPricePerPerson/, joi.string())
      .pattern(/group_totalPricePerPerson/, joi.string())
      .optional(),
  }); // .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.bookHTValidation = (data) => {
  const schema = joi.object().keys({
    amount: joi.string().required(),
    currency: joi.string().required(),
    receipt: joi.string().required(),
    couponCode: joi.string().optional(),
    hTSlotId: joi.string().required(),
    totalPeople: joi.string().required(),
  });
  return schema.validate(data);
};

exports.getHomeTutorForUserValidation = (data) => {
  const schema = joi
    .object()
    .keys({
      isPersonal: joi.boolean().optional(),
      isGroup: joi.boolean().optional(),
      language: joi.array().optional(),
      latitude: joi.string().optional(),
      longitude: joi.string().optional(),
      price: joi.string().optional(),
      page: joi.number().optional(),
      limit: joi.number().optional(),
      search: joi.string().optional(),
      distance: joi.number().optional(),
      yogaForh: joi.string().optional(),
    })
    .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.hTutorPriceValidation = (data) => {
  const schema = joi.object().keys({
    priceName: joi.string().required(),
    private_PricePerDayPerRerson: joi.string().required(),
    group_PricePerDayPerRerson: joi.string().required(),
    group_totalPricePerPerson: joi.string().required(),
    private_totalPricePerPerson: joi.string().required(),
    durationType: joi
      .string()
      .valid("monthly 25", "weekly 6", "monthly 30", "weekly 7", "daily")
      .required(),
  });
  return schema.validate(data);
};
