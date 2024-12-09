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

  } catch {
    (err) => {
      throw new Error(err.message);
    };
  }
};
