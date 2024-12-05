module.exports = (sequelize, DataTypes) => {
  const HTPayment = sequelize.define("hTPayments", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    durationType: {
      type: DataTypes.STRING,
      validate: {
        isIn: [["monthly 25", "weekly 6", "monthly 30", "weekly 7", "daily"]],
      },
      defaultValue: "daily",
    },
    amount: { type: DataTypes.STRING },
    currency: { type: DataTypes.STRING },
    receipt: { type: DataTypes.STRING },
    razorpayOrderId: { type: DataTypes.STRING },
    razorpayPaymentId: { type: DataTypes.STRING },
    razorpayTime: { type: DataTypes.STRING },
    status: {
      type: DataTypes.STRING,
      validate: { isIn: [["Created", "Paid", "Failed"]] },
    },
    verify: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    couponCode: { type: DataTypes.STRING },
    isAttended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    totalPeople: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    paidThrough: {
      type: DataTypes.STRING,
      validate: { isIn: [["Online", "Offline"]] },
    },
  });
  return HTPayment;
};

// Foriegn key
// userId
// homeTutorId
// hTSlotId
