module.exports = (sequelize, DataTypes) => {
  const HTPrice = sequelize.define(
    "hTPrices",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      priceName: {
        type: DataTypes.STRING,
      },
      private_PricePerDayPerRerson: {
        type: DataTypes.STRING,
      },
      group_PricePerDayPerRerson: {
        type: DataTypes.INTEGER,
      },
      durationType: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["monthly 25", "weekly 6", "monthly 30", "weekly 7", "daily"]],
        },
        defaultValue: "daily",
      },
      deletedThrough: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["Admin", "Instructor", "ByUpdation"]],
        },
      },
    },
    {
      paranoid: true,
    }
  );
  return HTPrice;
};

// ForiegnKey
// homeTutorId
