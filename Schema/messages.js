const mongoose = require("mongoose");

const messages = new mongoose.Schema({
  text: {
    type: String,
  },
  sender: {
    type: String,
  },
  receiver: {
    type: String,
  },
  time: {
    type: String,
  },
  receiverName: {
    type: String,
  },
  senderName: {
    type: String,
  },
});

module.exports = mongoose.model("Message", messages);
