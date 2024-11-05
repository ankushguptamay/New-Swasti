module.exports = (sequelize, DataTypes) => {
  const AppVersion = sequelize.define("appVersions", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    latestVerision: {
      type: DataTypes.STRING,
    },
  });
  return AppVersion;
};

// ForiegnKey
// userId
