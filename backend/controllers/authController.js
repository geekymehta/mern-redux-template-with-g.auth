const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../model/errorModel");
const mongoose = require("mongoose");

const registerUser = asyncHandler(async (req, res) => {
  const { name, userId, email, password } = req.body;

  if (!name || !userId || !email || !password) {
    // res.status(400);
    throw new AppError("Please fill in all required fields", 400);
  }

  const userIdAlreadyExists = await User.findOne({ userId: userId });

  if (userIdAlreadyExists) {
    // res.status(400);
    throw new AppError(
      "userId is unvailable, try using a different userId",
      400
    );
  }

  const userEmailAlreadyExists = await User.findOne({ email });
  if (userEmailAlreadyExists) {
    // res.status(400);
    throw new AppError(
      "Provided email is already registered with a different user, try using a different email",
      400
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  let user = new User({
    name,
    userId: userId,
    email,
    password: hashedPassword,
  });

  let sess;
  try {
    sess = await mongoose.startSession();
    sess.startTransaction();
    user = await user.save({ session: sess });
    user.token = generateToken(user._id);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    console.error(error);
    if (sess && sess.inTransaction()) {
      sess.abortTransaction();
    }
    throw new AppError(
      "Uh oh! Something went wrong, could not register user.",
      500
    );
  } finally {
    if (sess) {
      sess.endSession();
    }
  }
  res.status(201).json({
    _id: user.id,
    name: user.name,
    userId: user.userId,
    email: user.email,
    token: user.token,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists) {
    // res.status(400);
    throw new AppError("User does not exist", 400);
  }

  const matchedPassword = await bcrypt.compare(password, userExists.password);

  if (!matchedPassword) {
    // res.status(400);
    throw new AppError("Oops!, Wrong Password", 400);
  }
  const user = userExists;
  res.status(201).json({
    _id: user.id,
    name: user.name,
    userId: user.userId,
    email: user.email,
    token: generateToken(user._id),
  });
});

//@desc Get User data
//@route GET /api/auth/user
//@access Private
const getUserInfo = (req, res) => {
  const { _id, name, userId, email } = req.user;

  res.status(200).json({
    _id,
    name,
    userId,
    email,
  });
};

const generateToken = (id) => {
  expirationTimeInSeconds = 60 * 60; // eg. 30 * 24 * 60 * 60; -> 30 days in seconds
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expirationTimeInSeconds,
  });
};

module.exports = { registerUser, loginUser, getUserInfo, generateToken };
