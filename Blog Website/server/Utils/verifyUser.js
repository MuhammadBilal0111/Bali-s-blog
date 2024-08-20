const jwt = require("jsonwebtoken");
const CustomError = require("./CustomErrors");
const User = require("./../Model/userModel");
const util = require("util");

const verifyToken = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new CustomError("You are not logged in", 401));
  }
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return new CustomError("The user wiith token does not exist", 401);
  }
  req.user = user;
  next();
};

module.exports = verifyToken;
