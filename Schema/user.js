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
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],

  bio: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("user", userSchema);
