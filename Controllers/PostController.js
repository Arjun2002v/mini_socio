const { param } = require("../routes/authRoutes");
const messages = require("../Schema/messages");
const post = require("../Schema/post");
const user = require("../Schema/user");
const { find, findById } = require("../Schema/user");
const { Server } = require("socket.io");

//Get all Posts Logic

exports.getPost = async (req, res) => {
  const posts = await post.find().populate("createdBy", "name");
  res.json({ data: posts });
};
const io = new Server();

// Create a Post Logic

exports.createPost = async (req, res) => {
  const { content, media, userId } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }
  // if (!media) {
  //   res.json({ message: "Media is needed to create a Post" }).sendStatus(201);
  // }
  const newPost = await post({
    content,
    // media: media || [],
    createdBy: userId,
  });

  const data = await newPost.save();
  res.status(201).json({
    message: "Post has been created",
    data: data,
  });
};

// Delete a Post Logic

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  const deletedPost = await post.findByIdAndDelete(id);
  if (!deletedPost) {
    res.sendStatus(201).json({ message: "Your message couldn't be deleted" });
  } else {
    res.sendStatus(201).json({ message: "Post has been deleted" });
  }
};

// Edit Post Logic

exports.editPost = async (req, res) => {
  const { id } = req.params;
  const { content, media } = req.body;
  const updatedPost = {};
  if (content) updatedPost.content = content;
  // if (media) updatedPost.media = media;
  const updated = await post.findByIdAndUpdate(id, updatedPost, { new: true });

  if (updated) {
    res.json({ message: "Post has been updated" }).sendStatus(201);
  } else {
    res.json({ message: "Some Error updating the post" }).sendStatus(201);
  }
};

//Like the Post Logic

exports.likePost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("request", req?.user?._id);

    const updatedPost = await post.findByIdAndUpdate(
      id,
      { $addToSet: { likes: req?.user?._id } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({
      message: "Post liked successfully",
      data: updatedPost,
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

//Get Specific Post from particular user

exports.getSpecificPost = async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await post.find({ createdBy: id });

    return res.status(200).json(postDoc);
  } catch (error) {
    console.error("Error fetching post:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getUser = async (req, res) => {
  const users = await user.find();
  if (user.length === 0) {
    res.json({ message: "No users Found" }).sendStatus(201);
  } else {
    res.send({ users }).sendStatus(201);
  }
};

//Follows following logic Logic

exports.follow = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || !req.user?._id) {
      return res.status(400).json({ message: "No user found" });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }

    await user.findByIdAndUpdate(userId, {
      $addToSet: { followers: req.user._id },
    });

    await user.findByIdAndUpdate(req.user?._id, { following: userId });

    return res.status(201).json({ message: "New follower added" });
  } catch (error) {
    console.error("Follow error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

//Unfollow logic
exports.unfollows = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Target userId:", userId);
    console.log("Current user:", req.user?._id);

    const targetUser = await user.findById(userId);
    console.log("Before unfollow, followers:", targetUser.followers);

    const unfollow = await user.findByIdAndUpdate(
      userId,
      {
        $pull: { followers: req.user?._id },
      },
      { new: true }
    );

    console.log("After unfollow, followers:", unfollow.followers);

    await user.findByIdAndUpdate(
      req.user?._id,
      {
        $pull: { following: userId },
      },
      { new: true }
    );

    if (unfollow) {
      return res.status(200).json({ message: "Unfollowed successfully" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Unfollow error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.saveMessage = async (req, res) => {
  try {
    const { sender, text, time } = req.body;
    const data = new messages({ sender, time, text });
    const newMessage = await data.save();
    res
      .status(201)
      .json({
        text: req.body.text,
        sender: req.body.sender,
        time: req.body.time,
      });
  } catch {
    res.sendStatus(201).json({ error: "Error saving the message" });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const message = await messages.find().sort({ time: 1 });
    res.json({ message: message });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
