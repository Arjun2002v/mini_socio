const { param } = require("../routes/authRoutes");
const post = require("../Schema/post");

//Get all Posts Logic

exports.getPost = async (req, res) => {
  const posts = await post.find();
  res.send(posts);
};

//Create a Post Logic

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

//Delete a Post Logic

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  const deletedPost = await post.findByIdAndDelete(id);
  if (!deletedPost) {
    res.sendStatus(201).json({ message: "Your message couldn't be deleted" });
  } else {
    res.sendStatus(201).json({ message: "Post has been deleted" });
  }
};

exports.editPost = async (req, res) => {
  const { id } = req.params;
  const { content, media } = req.body;
  const updatedPost = {};
  if (content) updatedPost.content = content;
  if (media) updatedPost.media = media;
  await post.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json({ message: "Post has been updated" }).sendStatus(201);
};

//Like the Post Logic

exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedPost = await post.findByIdAndUpdate(
      id,
      { $addToSet: { likes: id } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Post liked successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

//Unlike Post Logic

exports.unlike = async (req, res) => {
  try {
    const { id } = req.params;
    const updatePost = await post.findByIdAndUpdate(id, {
      $pull: { likes: id },
    });

    if (!updatePost) {
      res.sendStatus(201).json({ message: "No Post found" });
    }
    res.sendStatus(201).json({ message: "Post has been Unliked" });
  } catch (error) {
    console.error("Error Unliking post:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
