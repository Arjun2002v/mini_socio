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
const http = require("http");

//For Creating Server so that it can connect
const { Server } = require("socket.io");

const server = http.createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
  methods: ["GET", "POST"],
  credentials: true,
});

app.use(cors());
const PORT = process.env.PORT || 5001;
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

app.delete("/posts/:id", verifyToken, unlike);

app.get("/users", getUser);

app.get("/posts/users/:id", getSpecificPost);

app.get("/verify", verifyToken);

app.post("/follows/:userId", verifyToken, follow);

app.post("/unfollow/:userId", verifyToken, unfollows);

app.delete("/flush", router);

io.on("connection", (socket) => {
  console.log(" User Connected", socket.id);
  socket.on("sendMessage", (data) => {
    console.log("Data Recieved", data);
    io.emit("receiveMessage", data);
  });

  socket.on("typing", (name) => {
    socket.broadcast.emit("showTyping,", name);
  });
});

server.listen(PORT, () => {
  console.log(`Server and Socket.IO running on port ${PORT}`);
});
