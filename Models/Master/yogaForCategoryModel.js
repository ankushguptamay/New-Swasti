const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const YogaForCategory = sequelize.define("yogaForCategories", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    yogaFor: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(1234),
    },
    path: {
      type: DataTypes.STRING(1234),
    },
    fileName: {
      type: DataTypes.STRING(1234),
    },
  });
  const today = new Date();
  today.setMinutes(today.getMinutes() + 330);

  const day = today.toISOString().slice(8, 10);
  const year = today.toISOString().slice(2, 4);
  const month = today.toISOString().slice(5, 7);

  YogaForCategory.beforeCreate(async (yoga) => {
    let startWith = `YFC${day}${month}${year}`; // Yoga For Category

    const lastSlug = await YogaForCategory.findOne({
      where: { slug: { [Op.startsWith]: startWith } },
      order: [["createdAt", "DESC"]],
    });
    let lastDigit;
    if (lastSlug) {
      lastDigit = parseInt(lastSlug.dataValues.slug.substring(9)) + 1;
    } else {
      lastDigit = 1;
    }

    let uniqueSlug = startWith + lastDigit;

    // Check if the slug already exists
    while (await YogaForCategory.findOne({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${startWith}${lastDigit++}`;
    }

    yoga.slug = uniqueSlug;
  });

  return YogaForCategory;
};
