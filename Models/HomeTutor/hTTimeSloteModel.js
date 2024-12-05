module.exports = (sequelize, DataTypes) => {
  const HTTimeSlot = sequelize.define(
    "hTTimeSlots",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      startDate: { type: DataTypes.DATEONLY },
      endDate: { type: DataTypes.DATEONLY },
      time: { type: DataTypes.STRING }, // 24 hour formate
      timeDurationInMin: { type: DataTypes.INTEGER },
      isBooked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isOnline: { type: DataTypes.BOOLEAN, defaultValue: false },
      serviceType: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["Group", "Private"]],
        },
        defaultValue: "Private",
      },
      durationType: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["monthly 25", "weekly 6", "monthly 30", "weekly 7", "daily"]],
        },
        defaultValue: "daily",
      },
      availableSeat: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      bookedSeat: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      password: { type: DataTypes.INTEGER },
      sloteCode: { type: DataTypes.STRING },
      appointmentStatus: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["Active", "Deactivate"]],
        },
        defaultValue: "Active",
      },
      deletedThrough: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["Admin", "Instructor", "ByUpdation"]],
        },
      },
      priceId: {
        type: DataTypes.UUID,
        references: {
          model: "hTPrices",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
    },
    {
      paranoid: true,
    }
  );
  return HTTimeSlot;
};

// homeTutorId
// serviceAreaId
// priceId
