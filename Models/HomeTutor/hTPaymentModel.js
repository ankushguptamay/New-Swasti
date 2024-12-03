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
    hTSlotId: { type: DataTypes.STRING },
    couponCode: { type: DataTypes.STRING },
    isAttended: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    noOfPeople: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    paidThroung: {
      type: DataTypes.STRING,
      validate: { isIn: [["Online", "Offline"]] },
    },
  });
  return HTPayment;
};

// Foriegn key
// userId
// homeTutorId

// This foreign key added to track data for admin. Because if payment is not verified or order created but not paid than admin panel can track which user try to join class
// If payment is verified only then we are creating records in HTBooking table. which is for instructor and user.
// Instructor can only see success payment.
