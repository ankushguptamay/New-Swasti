const { DataTypes } = require("sequelize");

exports.changeInData = (queryInterface) => {
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
  // queryInterface
  //   .dropTable("user_ht_slotes")
  //   .then((res) => {
  //     console.log("Table Droped 1!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .dropTable("hTBookings")
  //   .then((res) => {
  //     console.log("Table Droped 1!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .removeColumn("hTTimeSlots", "userPreferedLanguage")
  //   .then((res) => {
  //     console.log("Column removed!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .removeColumn("homeTutors", "privateSessionPrice_Day")
  //   .then((res) => {
  //     console.log("Column removed Form home tutor 1!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .removeColumn("homeTutors", "privateSessionPrice_Month")
  //   .then((res) => {
  //     console.log("Column removed Form home tutor 2!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .removeColumn("homeTutors", "groupSessionPrice_Month")
  //   .then((res) => {
  //     console.log("Column removed Form home tutor 3!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .removeColumn("homeTutors", "groupSessionPrice_Day")
  //   .then((res) => {
  //     console.log("Column removed Form home tutor 4!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .removeColumn("homeTutorHistories", "privateSessionPrice_Day")
  //   .then((res) => {
  //     console.log("Column removed Form home tutor 5!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .removeColumn("homeTutorHistories", "privateSessionPrice_Month")
  //   .then((res) => {
  //     console.log("Column removed Form home tutor 6!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .removeColumn("homeTutorHistories", "groupSessionPrice_Month")
  //   .then((res) => {
  //     console.log("Column removed Form home tutor 7!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .removeColumn("homeTutorHistories", "groupSessionPrice_Day")
  //   .then((res) => {
  //     console.log("Column removed Form home tutor 8!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .addColumn("hTTimeSlots", "durationType", {
  //     type: DataTypes.STRING,
  //     validate: {
  //       isIn: [["monthly 25", "weekly 6", "monthly 30", "weekly 7", "daily"]],
  //     },
  //     defaultValue: "daily",
  //   })
  //   .then((res) => {
  //     console.log("Added 1!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .addColumn("hTTimeSlots", "priceId", {
  //     type: DataTypes.UUID,
  //     references: { model: "hTPrices", key: "id" },
  //   })
  //   .then((res) => {
  //     console.log("foreign added!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .addColumn("hTTimeSlots", "startDate", {
  //     type: DataTypes.DATEONLY,
  //   })
  //   .then((res) => {
  //     console.log("added!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .addColumn("hTTimeSlots", "endDate", {
  //     type: DataTypes.DATEONLY,
  //   })
  //   .then((res) => {
  //     console.log("added!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  //   queryInterface.removeColumn("hTTimeSlots", "date")
  //   .then((res) => {
  //     console.log("removed!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  // .addColumn("users", "totalExperienceInYears", {
  //   type: DataTypes.INTEGER
  // })
  // .then((res) => {
  //   console.log("added!");
  // })
  // .catch((err) => {
  //   console.log(err);
  // });
  // queryInterface
  // .addColumn("instructorHistorys", "totalExperienceInYears", {
  //   type: DataTypes.INTEGER
  // })
  // .then((res) => {
  //   console.log("added!");
  // })
  // .catch((err) => {
  //   console.log(err);
  // });
  
  // queryInterface
  //   .addColumn("hTPrices", "private_totalPricePerPerson", {
  //     type: DataTypes.INTEGER,
  //   })
  //   .then((res) => {
  //     console.log("added!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .addColumn("hTPrices", "group_totalPricePerPerson", {
  //     type: DataTypes.INTEGER,
  //   })
  //   .then((res) => {
  //     console.log("added!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .changeColumn("hTPrices", "private_PricePerDayPerRerson", {
  //     type: DataTypes.INTEGER,
  //   })
  //   .then((res) => {
  //     console.log("changed!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .removeColumn("hTTimeSlots", "noOfPeople")
  //   .then((res) => {
  //     console.log("removed!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .addColumn("hTTimeSlots", "noOfPeopleCanBook", {
  //     type: DataTypes.INTEGER,
  //     defaultValue: 1,
  //   })
  //   .then((res) => {
  //     console.log("changed!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  // queryInterface
  //   .addColumn("hTTimeSlots", "bookedBy", {
  //     type: DataTypes.INTEGER,
  //     defaultValue: 0,
  //   })
  //   .then((res) => {
  //     console.log("changed!");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
