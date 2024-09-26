const jwt = require("jsonwebtoken");
const { ADMIN_JWT_SECRET_KEY, USER_JWT_SECRET_KEY } = process.env;

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

const verifyUserJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  // console.log('JWT Verif MW');
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, USER_JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.user = decoded;
    next();
  });
};

const authJwt = {
  verifyAdminJWT: verifyAdminJWT,
  verifyUserJWT: verifyUserJWT,
};
module.exports = authJwt;
