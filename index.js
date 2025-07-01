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

app.post("/post/create", createPost);

app.delete("/post/delete/:id", deletePost);

app.patch("/post/edit/:id", editPost);

app.patch("/post/like/:id", likePost);

app.patch("/post/unlike/:id", unlike);

app.listen(PORT, () => {
  console.log(`Running on Server ,${PORT}`);
});
