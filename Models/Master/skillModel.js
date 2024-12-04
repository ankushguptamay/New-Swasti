module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define("skills", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    skill: { type: DataTypes.STRING },
  });
  return Skill;
};
