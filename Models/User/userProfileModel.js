module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    "userProfiles",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      originalName: {
        type: DataTypes.STRING,
      },
      path: {
        type: DataTypes.STRING(1234),
      },
      fileName: {
        type: DataTypes.STRING(1234),
      },
      deletedThrough: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["Admin", "Self", "ByUpdation"]],
        },
      },
    },
    { paranoid: true }
  );
  return UserProfile;
};

// ForiegnKey
// userId
