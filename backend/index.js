const express = require("express");
const dotenv = require("dotenv").config();
const colors = require("colors");
const morgan = require("morgan");
const AppError = require("./model/errorModel");
const connectDB = require("./config/db");
const passport = require("passport");
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use("/api/gpt", require("./routes/gptRoutes"));

app.use("/api/gpt/chats", require("./routes/chatRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

app.use((req, res, next) => {
  next(new AppError("Route Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong", stack = null } = err;

  console.log("status : " + status);
  console.log("error_message : " + message);
  console.log("stack : " + stack);
  res.status(err.status).json({ status: status, error: message, stack: stack });
  // next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
