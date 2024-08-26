const User = require("./../Model/userModel");
const CustomErrors = require("../Utils/CustomErrors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const transporter = require("./../Utils/email.js");

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};
const createSendResponse = (user, statusCode, res) => {
  const { password: pass, ...data } = user._doc; // ...data==>...rest
  const token = signToken(user._id, user.role);
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
const sendEmail = async (email, message) => {
  const mailOptions = {
    from: "m.bilal0111@gmail.com",
    to: email,
    subject: "Password change request received",
    text: message,
  };
  await transporter.sendMail(mailOptions);
};

exports.signUp = async (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;
  if (!username || !email || !password || !confirmPassword) {
    return next(new CustomErrors("Please fill out all fields", 400));
  }
  try {
    const user = await User.create(req.body);
    createSendResponse(user, 201, res);
  } catch (err) {
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
        role: "user",
        profilePicture: googlePhotoUrl,
      });
      const user = await User.create(newUser);
      return createSendResponse(user, 201, res);
    }
  } catch (err) {
    next(err);
  }
};
exports.forgetPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new CustomErrors("We cannot find the user with the given email")
      );
    }
    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    console.log(resetToken);
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/reset-password/${resetToken}`;
    const message = `We have received a password reset request. Please use the below link to  reset your password \n\n ${resetUrl}\n\n This password link will be valid only for 10 minutes`;
    try {
      await sendEmail(req.body.email, message);
      res.status(200).json({
        status: "success",
        message: "Password reset link sent to the user's email",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      user.save({ validateBeforeSave: false });
      return next(
        new CustomErrors(
          "There was an error in sending reset password email! Please try again later" +
            err,
          500
        )
      );
    }
  } catch (err) {
    next(err);
  }
};
exports.resetPassword = async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new CustomErrors("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();
    createSendResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};
