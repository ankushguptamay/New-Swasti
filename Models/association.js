exports.associations = (db) => {
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

  // User Association with hTPayment
  db.user.hasMany(db.hTPayment, { foreignKey: "userId", as: "hTPayments" });
  db.hTPayment.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
  });

  // User Association with Address
  db.user.hasMany(db.address, { foreignKey: "userId", as: "address" });
  db.address.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
  });

  // Home Tutor
  db.user.hasMany(db.homeTutor, {
    foreignKey: "instructorId",
    as: "homeTutors",
  });
  db.homeTutor.belongsTo(db.user, {
    foreignKey: "instructorId",
    as: "instructors",
  });

  db.homeTutor.hasMany(db.hTServiceArea, {
    foreignKey: "homeTutorId",
    as: "serviceAreas",
  });
  db.hTServiceArea.belongsTo(db.homeTutor, {
    foreignKey: "homeTutorId",
    as: "homeTutors",
  });

  db.homeTutor.hasMany(db.hTPrice, {
    foreignKey: "homeTutorId",
    as: "hTPrices",
  });
  db.hTPrice.belongsTo(db.homeTutor, {
    foreignKey: "homeTutorId",
    as: "homeTutors",
  });

  db.hTTimeSlote.belongsTo(db.hTPrice, {
    foreignKey: "priceId",
    as: "hTPrices",
  });

  db.homeTutor.hasMany(db.hTTimeSlote, {
    foreignKey: "homeTutorId",
    as: "timeSlotes",
  });
  db.hTTimeSlote.belongsTo(db.homeTutor, {
    foreignKey: "homeTutorId",
    as: "homeTutors",
  });

  db.hTTimeSlote.hasMany(db.hTPayment, {
    foreignKey: "hTSlotId",
    as: "hTPayments",
  });
  db.hTPayment.belongsTo(db.hTTimeSlote, {
    foreignKey: "hTSlotId",
    as: "hTSlots",
  });

  db.homeTutor.hasMany(db.hTPayment, {
    foreignKey: "homeTutorId",
    as: "hTPayment",
  });
  db.hTPayment.belongsTo(db.homeTutor, {
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
};
