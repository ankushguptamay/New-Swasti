module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "userAddress",
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
    },
    { paranoid: true }
  );
  return Address;
};
