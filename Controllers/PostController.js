const { param } = require("../routes/authRoutes");
const post = require("../Schema/post");

//Get all Posts

exports.getPost = async (req, res) => {
  const posts = await post.find();
  res.send(posts);
};

//Create a Post

exports.createPost = async (req, res) => {
  const { content, media } = req.body;

  if (!content) {
    res.json({ message: "Content is required" }).sendStatus(201);
  }
  if (!media) {
    res.json({ message: "Media is needed to create a Post" }).sendStatus(201);
  }
  const newPost = await post({
    content,
    media: media || [],
  });

  await newPost.save();
  res.sendStatus(201).json({ message: "Post has been created" });
};

//Delete a Post

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  const deletedPost = await post.findByIdAndDelete(id);
  if (!deletedPost) {
    res.sendStatus(201).json({ message: "Your message couldn't be deleted" });
  } else {
    res.sendStatus(201).json({ message: "Post has been deleted" });
  }
};
