module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "userAddress",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      addressType: {
        type: DataTypes.STRING, // Home, Office, Hotel
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
      address: {
        type: DataTypes.STRING,
      },
      zipCode: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      latitude: {
        type: DataTypes.FLOAT(10, 6),
      },
      longitude: { type: DataTypes.FLOAT(10, 6) },
      deletedThrough: {
        type: DataTypes.STRING,
        validate: {
          isIn: [["Admin", "Self", "ByUpdation"]],
        },
      },
    },
    { paranoid: true }
  );
  return Address;
};
