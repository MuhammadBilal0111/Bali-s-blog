const User = require("./../Model/userModel");
const CustomErrors = require("../Utils/CustomErrors");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};
const createSendResponse = (user, statusCode, res) => {
  const { password: pass, ...data } = user._doc; // ...data==>...rest
  const token = signToken(user._id);
  const options = {
    maxAge: process.env.LOGIN_EXPIRES,
    httpOnly: true,
    secure: true,
  };
  res.cookie("jwt", token, options);
  res.status(statusCode).json({
    status: "success",
    token,
    data,
  });
};
const generatePassword = () => {
  return (
    Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
  );
};
exports.signUp = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword) {
    // res.status(400).json({
    //   status: "failed",
    //   message: "All fields are required",
    // });
    return next(new CustomErrors("Please fill out all fields", 400));
  }
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    // res.status(500).json({
    //   message: err.message,
    // });
    next(err);
  }
};
exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new CustomErrors("Please provide email ID and password for login", 400)
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomErrors("User Not Found, Please Sign Up", 404));
    } else if (!(await user.comparePasswordInDb(password, user.password))) {
      return next(new CustomErrors("Password is Incorrect", 401));
    }
    createSendResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};
exports.googleAuth = async (req, res, next) => {
  // console.log(req.body);
  const { username, email, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      return createSendResponse(user, 201, res);
    } else {
      const randomPassword = generatePassword();
      const newUser = new User({
        username,
        email,
        password: randomPassword,
        confirmPassword: randomPassword,
        profilePicture: googlePhotoUrl,
      });
      const user = await User.create(newUser);
      return createSendResponse(user, 201, res);
    }
  } catch (err) {
    next(err);
  }
};
