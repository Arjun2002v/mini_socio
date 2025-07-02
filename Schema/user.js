const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "",
  },
  followers: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("user", userSchema);
