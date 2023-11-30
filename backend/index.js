const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const AppError = require("./models/errorModel");
const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/gpt", require("./routes/gptRoutes"));

app.use((req, res, next) => {
  next(new AppError("Route Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "something went wrong" } = err;

  console.log("status : " + status);
  console.log("error_message : " + message);
  res.status(err.status).json({ error: message, status: status });
  // next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
