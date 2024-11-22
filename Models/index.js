const dbConfig = require("../Config/db.Config.js");

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};
const queryInterface = sequelize.getQueryInterface();
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Admin
db.admin = require("./Admin/adminModel.js")(sequelize, Sequelize);
db.emailCredential = require("./Admin/bravoEmailCredentialModel.js")(
  sequelize,
  Sequelize
);
db.userNotification = require("./Admin/userNotificationModel.js")(
  sequelize,
  Sequelize
);

// Master
db.coupon = require("./Master/couponModel.js")(sequelize, Sequelize);
db.yogaForCategory = require("./Master/yogaForCategoryModel.js")(
  sequelize,
  Sequelize
);
db.adminBanner = require("./Master/bannerModel.js")(sequelize, Sequelize);
db.courseCategory = require("./Master/courseCategoryModel.js")(
  sequelize,
  Sequelize
);
db.courseType = require("./Master/courseTypeModel.js")(sequelize, Sequelize);
db.courseDuration = require("./Master/courseDurationModel.js")(
  sequelize,
  Sequelize
);

db.courseDurationType = require("./Master/courseDurationTypeModel.js")(
  sequelize,
  Sequelize
);
db.university_institute = require("./Master/university_institute_nameModel.js")(
  sequelize,
  Sequelize
);
db.hTSpecilization = require("./Master/hTSpecilizationModel.js")(
  sequelize,
  Sequelize
);

// Review
db.instructorReview = require("./Review/instructorReviewModel.js")(
  sequelize,
  Sequelize
);

// User
db.user = require("./User/userModel.js")(sequelize, Sequelize);
db.emailOTP = require("./User/emailOTPModel.js")(sequelize, Sequelize);
db.chakra = require("./User/chakraModel.js")(sequelize, Sequelize);
db.address = require("./User/userAddressModel.js")(sequelize, Sequelize);
db.referralHistory = require("./User/referralHistoryModel.js")(
  sequelize,
  Sequelize
);
db.userProfile = require("./User/userProfileModel.js")(sequelize, Sequelize);
db.userWallet = require("./User/userWalletModel.js")(sequelize, Sequelize);

// Instructor
db.insturctorQualification =
  require("./User/Instructor/insturctorQualificationModel.js")(
    sequelize,
    Sequelize
  );
db.instructorExperience =
  require("./User/Instructor/instructorExperienceModel.js")(
    sequelize,
    Sequelize
  );
db.instructorBankDetails =
  require("./User/Instructor/instructorBankDetailsModel.js")(
    sequelize,
    Sequelize
  );
db.instructorKYC = require("./User/Instructor/instructorKYCModel.js")(
  sequelize,
  Sequelize
);
db.instructorHistory =
  require("./User/Instructor/InstructorHistory/instructorHistoryModel.js")(
    sequelize,
    Sequelize
  );

//Home Tutor
db.homeTutor = require("./HomeTutor/homeTutorModel.js")(sequelize, Sequelize);
db.ht_coupon = require("./HomeTutor/ht_Coupon_JunctionModel.js")(
  sequelize,
  Sequelize
);
db.hTServiceArea = require("./HomeTutor/hTServiceAreaModel.js")(
  sequelize,
  Sequelize
);
db.hTTimeSlote = require("./HomeTutor/hTTimeSloteModel.js")(
  sequelize,
  Sequelize
);
db.userHTSlote = require("./HomeTutor/sloteUserJunctionModel.js")(
  sequelize,
  Sequelize
);
db.hTImage = require("./HomeTutor/hTImageModel.js")(sequelize, Sequelize);
db.homeTutorHistory = require("./HomeTutor/homeTutorHistoryModel.js")(
  sequelize,
  Sequelize
);
db.hTBooking = require("./HomeTutor/hTBookingModel.js")(sequelize, Sequelize);
db.hTReview = require("./Review/hTReviewModel.js")(sequelize, Sequelize);
db.appVersion = require("./User/appVersionModel.js")(sequelize, Sequelize);

// Notification
db.createNotification = require("./createNotificationModel.js")(
  sequelize,
  Sequelize
);
db.campaignEmail = require("./campaignEmailModel.js")(sequelize, Sequelize);
db.campaignEmailCredential = require("./campaignEmailCredentialsModel.js")(
  sequelize,
  Sequelize
);

// User association with profile
db.user.hasOne(db.userProfile, {
  foreignKey: "userId",
  as: "profilePic",
});

// User's Association with User wallet
db.user.hasOne(db.userWallet, {
  foreignKey: "userId",
  as: "wallets",
});
db.userWallet.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});

// Instructor's Association with Qualification
db.user.hasMany(db.insturctorQualification, {
  foreignKey: "instructorId",
  as: "qualifications",
});
// Instructor's Association with Bank Details
db.user.hasMany(db.instructorBankDetails, {
  foreignKey: "instructorId",
  as: "bankDetails",
});
// Instructor's Association with KYC
db.user.hasOne(db.instructorKYC, {
  foreignKey: "instructorId",
  as: "kycs",
});
// Instructor's Association with Experience
db.user.hasMany(db.instructorExperience, {
  foreignKey: "instructorId",
  as: "experience",
});
// Instructor's Association with Instructor history
db.user.hasMany(db.instructorHistory, {
  foreignKey: "instructorId",
  as: "updateHistory",
});

// Master Association
db.university_institute.hasMany(db.courseDurationType, {
  foreignKey: "universityId",
  as: "courses",
});
db.courseDurationType.belongsTo(db.university_institute, {
  foreignKey: "universityId",
  as: "university",
});

// Instructor Association with review
db.user.hasMany(db.instructorReview, {
  foreignKey: "instructorId",
  as: "review",
});

// Instructor Association with review
db.user.hasMany(db.userNotification, {
  foreignKey: "userId",
  as: "userNotifications",
});

// User Association with UserHTSlote
db.user.hasMany(db.userHTSlote, { foreignKey: "userId", as: "userHTSlote" });
db.userHTSlote.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});
// User Association with Address
db.user.hasMany(db.address, { foreignKey: "userId", as: "address" });
db.address.belongsTo(db.user, {
  foreignKey: "userId",
  as: "user",
});
// hTTimeSlote Association with UserHTSlote
db.hTTimeSlote.hasMany(db.userHTSlote, {
  foreignKey: "sloteId",
  as: "userHTSlote",
});
db.userHTSlote.belongsTo(db.hTTimeSlote, {
  foreignKey: "sloteId",
  as: "slote",
});

// Home Tutor
db.user.hasMany(db.homeTutor, {
  foreignKey: "instructorId",
  as: "homeTutors",
});

db.homeTutor.hasMany(db.hTServiceArea, {
  foreignKey: "homeTutorId",
  as: "serviceAreas",
});
db.hTServiceArea.belongsTo(db.homeTutor, {
  foreignKey: "homeTutorId",
  as: "homeTutors",
});

db.homeTutor.hasMany(db.hTTimeSlote, {
  foreignKey: "homeTutorId",
  as: "timeSlotes",
});
db.hTTimeSlote.belongsTo(db.homeTutor, {
  foreignKey: "homeTutorId",
  as: "homeTutors",
});

db.hTTimeSlote.belongsTo(db.hTServiceArea, {
  foreignKey: "serviceAreaId",
  as: "serviceArea",
});

db.homeTutor.hasMany(db.hTImage, { foreignKey: "homeTutorId", as: "images" });
db.hTImage.belongsTo(db.homeTutor, {
  foreignKey: "homeTutorId",
  as: "homeTutors",
});

db.homeTutor.hasMany(db.homeTutorHistory, {
  foreignKey: "homeTutorId",
  as: "homeTutorHistories",
});

db.homeTutor.hasMany(db.hTReview, {
  foreignKey: "homeTutorId",
  as: "hTReviews",
});

db.homeTutor.hasMany(db.ht_coupon, {
  foreignKey: "homeTutorId",
  as: "ht_coupons",
});
db.ht_coupon.belongsTo(db.homeTutor, {
  foreignKey: "homeTutorId",
  as: "homeTutors",
});
db.coupon.hasMany(db.ht_coupon, { foreignKey: "couponId", as: "ht_coupons" });
db.ht_coupon.belongsTo(db.coupon, {
  foreignKey: "couponId",
  as: "coupons",
});

// For Location
db.hTServiceArea.addScope(
  "distance",
  (latitude, longitude, distance, unit = "km") => {
    const constant = unit == "km" ? 6371 : 3959;
    const haversine = `(
        ${constant} * acos(
            cos(radians(${latitude}))
            * cos(radians(latitude))
            * cos(radians(longitude) - radians(${longitude}))
            + sin(radians(${latitude})) * sin(radians(latitude))
        )
    )`;
    return {
      attributes: [[sequelize.literal(haversine), "distance"]],
      having: sequelize.literal(`distance <= ${distance}`),
    };
  }
);

// This many to many relation auto deleteing table after create it.......?
// db.leadProfile.belongsToMany(
//     db.userInformation, {
//     through: "lead_To_User",
//     foreignKey: "leadProfileCode",
//     otherKey: "userInformationCode",
//     targetKey: "userCode",
//     sourceKey: "leadCode",
//     as: 'users'
// }
// );
// db.userInformation.belongsToMany(
//     db.leadProfile, {
//     through: "lead_To_User",
//     foreignKey: "userInformationCode",
//     otherKey: 'leadProfileCode',
//     targetKey: "leadCode",
//     sourceKey: "userCode",
//     as: "leads"
// }
// );

// db.emailCredential.findOne({
//     where: {
//         email: process.env.BREVO_EMAIL
//     }
// }).then((res) => {
//     console.log(res);
//     if (!res) {
//         db.emailCredential.create({
//             email:process.env.BREVO_EMAIL,
//             plateForm: "BREVO",
//             EMAIL_API_KEY: process.env.EMAIL_API_KEY
//         });
//     }
// }).catch((err) => { console.log(err) });

queryInterface
  .removeColumn("homeTutors", "isPublish")
  .then((res) => {
    console.log("removed!");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = db;
