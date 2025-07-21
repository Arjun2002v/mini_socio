const mongoose = require("mongoose");

const message = new mongoose.Schema({
  text: String,
  sender: String,
  time: Number,
});

module.exports = mongoose.model("Message", message);
