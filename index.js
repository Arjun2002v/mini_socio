const express = require("express");

const connectDB = require("./Database/Mongo");
const router = require("./routes/authRoutes");
const {
  createPost,
  getPost,
  deletePost,
  editPost,
  likePost,
  unlike,
  getSpecificPost,
} = require("./Controllers/PostController");
require("dotenv").config();
const app = express();

const PORT = 5000;
connectDB();
if (!connectDB) {
  console.error("MongoDB URI not found in .env file");
  process.exit(1);
}
app.use(express.json());

app.post("/signup", router);

app.post("/login", router);

app.get("/post", getPost);

app.post("/posts", createPost);

app.delete("/posts/:id", deletePost);

app.patch("/posts/:id", editPost);

app.post("/posts/:id/like", likePost);

app.delete("/posts/:id/unlike", unlike);

app.get("/post/:id", getSpecificPost);

app.listen(PORT, () => {
  console.log(`Running on Server ,${PORT}`);
});
