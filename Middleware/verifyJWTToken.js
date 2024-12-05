const jwt = require("jsonwebtoken");
const { ADMIN_JWT_SECRET_KEY, USER_JWT_SECRET_KEY } = process.env;
const db = require("../Models");
const User = db.user;
const UserProfile = db.userProfile;

const verifyAdminJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // console.log('JWT Verif MW');
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, ADMIN_JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.admin = decoded;
    next();
  });
};

const verifyUserJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    // console.log('JWT Verif MW');
    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, USER_JWT_SECRET_KEY);
    const user = await User.findOne({
      where: { id: decode.id },
      attributes: [
        "id",
        "phoneNumber",
        "email",
        "name",
        "languages",
        "bio",
        "dateOfBirth",
        "isInstructor",
        "totalExperienceInYears",
        "homeTutorTermAccepted",
        "userCode",
      ],
      include: [
        {
          model: UserProfile,
          as: "profilePic",
          where: { deletedThrough: null },
          attributes: ["id", "path"],
          required: false,
        },
      ],
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    // console.log(user.dataValues);
    req.user = user.dataValues;
    return next();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const authJwt = {
  verifyAdminJWT: verifyAdminJWT,
  verifyUserJWT: verifyUserJWT,
};
module.exports = authJwt;
