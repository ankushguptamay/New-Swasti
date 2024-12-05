const dbConfig = require("../Config/db.Config.js");

const { Sequelize, DataTypes } = require("sequelize");
const { changeInData } = require("./qreryInterface.js");
const { associations } = require("./association.js");
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
db.skill = require("./Master/skillModel.js")(sequelize, Sequelize);
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

// Home Tutor
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

db.hTPrice = require("./HomeTutor/hTPriceModel.js")(sequelize, Sequelize);
db.hTPayment = require("./HomeTutor/hTPaymentModel.js")(sequelize, Sequelize);
db.hTImage = require("./HomeTutor/hTImageModel.js")(sequelize, Sequelize);
db.homeTutorHistory = require("./HomeTutor/homeTutorHistoryModel.js")(
  sequelize,
  Sequelize
);

db.hTReview = require("./Review/hTReviewModel.js")(sequelize, Sequelize);
db.appVersion = require("./User/appVersionModel.js")(sequelize, Sequelize);

// Notification
db.createNotification = require("./Admin/createNotificationModel.js")(
  sequelize,
  Sequelize
);
db.campaignEmail = require("./Admin/campaignEmailModel.js")(
  sequelize,
  Sequelize
);
db.campaignEmailCredential =
  require("./Admin/campaignEmailCredentialsModel.js")(sequelize, Sequelize);

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
      // where: sequelize.literal(`${haversine} <= GREATEST(radius, ${distance})`),
      having: sequelize.literal(`distance <= ${distance}`),
    };
  }
);

// All Association
associations(db);
// All Query Interface
changeInData(queryInterface);

module.exports = db;
