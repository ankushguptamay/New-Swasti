const { DataTypes } = require("sequelize");

exports.changeInData = async (queryInterface) => {
  try {
    // db.emailCredential
    //   .findOne({
    //     where: {
    //       email: process.env.BREVO_EMAIL,
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res);
    //     if (!res) {
    //       db.emailCredential.create({
    //         email: process.env.BREVO_EMAIL,
    //         plateForm: "BREVO",
    //         EMAIL_API_KEY: process.env.EMAIL_API_KEY,
    //       });
    //     }
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    queryInterface
      .addColumn("users", "totalExperienceInYears", {
        type: DataTypes.INTEGER,
      })
      .then((res) => {
        console.log("added!");
      })
      .catch((err) => {
        console.log(err);
      });
    queryInterface
      .addColumn("instructorHistorys", "totalExperienceInYears", {
        type: DataTypes.INTEGER,
      })
      .then((res) => {
        console.log("added!");
      })
      .catch((err) => {
        console.log(err);
      });

    // await queryInterface.dropTable("user_ht_slotes");
    // await queryInterface.dropTable("hTBookings");
    // await queryInterface.dropTable("homeTutorHistories");
    // console.log("homeTutorHistories");
    // await queryInterface.dropTable("ht_coupons");
    // console.log("ht_coupons");
    // await queryInterface.dropTable("hTutorImages");
    // console.log("hTutorImages");
    // await queryInterface.dropTable("hTPayments");
    // console.log("hTPayments");
    // await queryInterface.dropTable("hTTimeSlots");
    // console.log("hTTimeSlots");
    // await queryInterface.dropTable("hTPrices");
    // console.log("hTPrices");
    // await queryInterface.dropTable("homeTutorReviews");
    // console.log("homeTutorReviews");
    // await queryInterface.dropTable("hTServiceAreas");
    // console.log("hTServiceAreas");
    // await queryInterface.dropTable("homeTutors");
    // console.log("homeTutors");
  } catch {
    (err) => {
      throw new Error(err.message);
    };
  }
};
