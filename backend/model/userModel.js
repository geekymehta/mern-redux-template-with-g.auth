const mongoose = require("mongoose");
const validator = require("validator");
// const { uniqueValidator } = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    userId: {
      type: String,
      required: [true, "userId is required"],
      unique: true,
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Invalid email address",
      },
    },
    googleId: {
      type: String,
      sparse: true, //To allow googleId to be either unique or null, you can use a sparse index in MongoDB. A sparse index only includes documents for which the indexed field exists. This means that multiple documents can have a googleId of null, but any non-null googleId must be unique.
      unique: true,
    },
    token: { type: String },
    refreshToken: { type: String },

    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);

module.exports = User;
