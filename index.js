const express = require("express");

const connectDB = require("./Database/Mongo");
const cors = require("cors");
const router = require("./routes/authRoutes");
const {
  createPost,
  getPost,
  deletePost,
  editPost,
  likePost,
  unlike,
  getSpecificPost,
  getUser,
  follow,

  unfollows,
} = require("./Controllers/PostController");
const verifyToken = require("./middleWare/authMiddle");
require("dotenv").config();
const app = express();

app.use(cors());
const PORT = process.env.PORT || 5000;
connectDB();
if (!connectDB) {
  console.error("MongoDB URI not found in .env file");
  process.exit(1);
}
app.use(express.json());

app.post("/signup", router);

app.get("/users/:id", router);

app.post("/login", router);

app.get("/posts", getPost);

app.post("/posts", createPost);

app.delete("/posts/:id", deletePost);

app.patch("/posts/:id", editPost);

app.post("/posts/:id/like", verifyToken, likePost);

app.delete("/posts/:id", unlike);

app.get("/users", getUser);

app.get("/posts/users/:id", getSpecificPost);

app.get("/verify", verifyToken);

app.post("/follows/:userId", follow);

app.post("/unfollow/:userId", unfollows);

app.delete("/flush", router);

app.listen(5000, () => {
  console.log("Running on 500");
});
