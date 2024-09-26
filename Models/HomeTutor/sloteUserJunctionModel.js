module.exports = (sequelize, DataTypes) => {
  const UserHTSlote = sequelize.define("user_ht_slotes", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    visitStatus: {
      type: DataTypes.STRING,
      validate: {
        isIn: [
          [
            "Visited",
            "InProcess",
            "Cancelld",
            "NonVisited",
            "SloteDeactivated",
          ],
        ],
      },
      defaultValue: "InProcess",
    },
    paidThroung: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["Online", "Offline"]],
      },
    },
  });
  return UserHTSlote;
};
