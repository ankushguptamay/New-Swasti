module.exports = (sequelize, DataTypes) => {
  const InstructorHistory = sequelize.define(
    "instructorHistorys",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
      instructorType: {
        type: DataTypes.STRING,
        validate: {
          isIn: {
            args: [["Instructor", "Teacher", "Coach", "Trainer"]],
            msg: "Must be Instructor, Teacher, Coach or Trainer!",
          },
        },
      },
      totalExperienceInYears: { type: DataTypes.INTEGER },
      bio: {
        type: DataTypes.STRING(1234),
      },
      socialMediaLink: {
        type: DataTypes.STRING(1234),
      },
      linkedIn: {
        type: DataTypes.STRING,
      },
      twitter_x: {
        type: DataTypes.STRING,
      },
      instagram: {
        type: DataTypes.STRING,
      },
      facebook: {
        type: DataTypes.STRING,
      },
      languages: {
        type: DataTypes.JSON,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
      },
    },
    {
      paranoid: true,
    }
  );
  return InstructorHistory;
};

// ForiegnKey
// instructorId
