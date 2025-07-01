const { mongo, default: mongoose } = require("mongoose");

const post = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  media: [
    {
      type: String,
      required: true,
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
  },
  comment: {
    type: String,
    ref: "post",
  },
});

module.exports = mongoose.model("post", post);
