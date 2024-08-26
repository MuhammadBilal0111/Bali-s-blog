const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "PLease enter username"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter valid E-mail"],
    },
    password: {
      type: String,
      required: [true, "Please enter password"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Please enter confirm password"],
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "Password and confirm Password does not match",
      },
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = null;
  next();
});
userSchema.methods.comparePasswordInDb = async function (
  password,
  hashedPassword
) {
  return await bcrypt.compare(password, hashedPassword);
};
userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
