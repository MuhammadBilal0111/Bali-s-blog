const CustomErrors = require("../Utils/CustomErrors");
const bycrypt = require("bcryptjs");
const User = require("./../Model/userModel");

exports.updateUser = async (req, res, next) => {
  if (req.params.userId !== String(req.user._id)) {
    return next(new CustomErrors("You are not allowed to update the user"));
  }
  if (req.body.password) {
    if (req.body.password < 8) {
      return next(
        new CustomErrors("The password should not be less than 8", 401)
      );
    }
    req.body.password = await bycrypt.hash(req.body.password, 12);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 22) {
      return next(
        new CustomErrors(
          "Username should be greater than 7 and less than 22",
          401
        )
      );
    }
  }
  if (req.body.username?.match(/^[A-Za-z0-9]+$/)) {
    return next(
      new CustomErrors("Username should not contain special characters", 401)
    );
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );
    const { password, ...data } = updatedUser._doc;
    return res.status(201).json({
      status: "success",
      data,
    });
  } catch (err) {
    next(err);
  }
};
exports.signOut = async (req, res, next) => {
  if (req.params.userId !== String(req.user._id)) {
    return next(
      new CustomErrors("You are not allowed to sign out the account")
    );
  }
  try {
    res.clearCookie("jwt");
    // const user = await User.findByIdAndUpdate(req.params.id, { active: false });
    // const { password, ...data } = user._doc;
    res.status(201).json({
      status: "success",
    });
  } catch (err) {
    next(err);
  }
};
exports.deleteUser = async (req, res, next) => {
  if (req.user.role === "admin" && req.params.userId !== String(req.user._id)) {
    return next(new CustomErrors("You are not allowed to delete the account",403));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json({
      status: "success",
      message: "Successfully deleted account",
    });
  } catch (err) {
    next(err);
  }
};
exports.getUsers = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(
      new CustomErrors("You are not allowed to see all the users", 403)
    );
  }
  const startIndex = req.query.startIndex * 1 || 0;
  const limit = req.query.limit || 9;
  const sortDirection = req.query.sort === "asc" ? 1 : -1;
  try {
    const dataRetrive = await User.find()
      .limit(limit)
      .skip(startIndex)
      .sort({ createdAt: sortDirection });
    const usersWithoutPassword = dataRetrive.map((obj) => {
      const { password, ...rest } = obj._doc;
      return rest;
    });
    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({
      status: "success",
      data: {
        users: usersWithoutPassword,
        totalUsers,
        lastMonthUsers,
      },
    });
  } catch (err) {
    next(err);
  }
};
