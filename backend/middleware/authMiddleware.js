const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const AppError = require("../model/errorModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        throw new Error("user not found");
      }

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        throw new Error("user not found");
      }
    } catch (error) {
      console.error(error);
      throw new AppError(error.message, 401);
    }
  } else {
    throw new AppError("Not authorized, no token", 401);
  }

  next();
});

module.exports = { protect };
