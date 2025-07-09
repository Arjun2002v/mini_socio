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

  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],

  comment: {
    type: String,
    ref: "post",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

module.exports = mongoose.model("post", post);
