const mongoose = require("mongoose");

const post = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  media: [
    {
      type: String,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});
module.exports = mongoose.model("post", post);
