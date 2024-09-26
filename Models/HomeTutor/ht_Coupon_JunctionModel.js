module.exports = (sequelize, DataTypes) => {
  const HT_Coupon_Junctions = sequelize.define(
    "ht_coupons",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      creater: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["Admin", "Instructor"]],
        },
      },
      createrId: {
        type: DataTypes.STRING,
      },
      validTill: {
        type: DataTypes.STRING,
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
  return HT_Coupon_Junctions;
};

// Foriegnkey
// homeTutorId
// couponId
