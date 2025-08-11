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
  getMessage,
  saveMessage,
} = require("./Controllers/PostController");
const verifyToken = require("./middleWare/authMiddle");
require("dotenv").config();
const app = express();
const http = require("http");

//For Creating Server so that it can connect
const { Server } = require("socket.io");
const user = require("./Schema/user");
const multer = require("multer");
const messages = require("./Schema/messages");
const path = require("path");

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

const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("Files", req.file);
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    message: "File uploaded successfully",
    file: req?.file,
  });
});

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

app.post("/user/message", saveMessage);

app.get("/posts/users/:id", getSpecificPost);

app.get("/verify", verifyToken);

app.post("/follows/:userId", verifyToken, follow);

app.post("/unfollow/:userId", verifyToken, unfollows);
app.get("/message", getMessage);

app.delete("/flush", router);
let users = [];

io.on("connection", (socket) => {
  //Sending Message

  //Showing Typing Status when someone is typing

  socket.on("typing", (name) => {
    console.log("Typing...", name);
    socket.broadcast.emit("typing", `${name} is typing...`);
  });

  //Private Messaging

  //Saving the UserID
  socket.on("register", (userId) => {
    users[userId] = socket.id;
    console.log(`User registered: ${userId} => ${socket.id}`);
  });

  //Handle Sending User Message
  socket.on(
    "private",
    ({ sender, receiver, text, receiverName, senderName }) => {
      console.log("USERS", users);
      const recieverSocketId = users.find((user) => user.userId === receiver);

      console.log("Reciever", recieverSocketId);
      if (recieverSocketId) {
        io.to(recieverSocketId).emit("receiveMessage", {
          sender,
          receiver,
          text,
          receiverName,
          senderName,
        });
      }
      const senderSocket = users[sender];

      if (senderSocket) {
        io.to(senderSocket).emit("receiveMessage", {
          sender,
          receiver,
          text,
          receiverName,
          senderName,
        });
      }
    }
  );

  socket.on("sendNotification", (message, userId) => {
    io.to(users[userId]).emit("getNotification", { message });
  });
  //Disconnect the Message
  socket.on("disconnect", () => {
    for (const [userId, socketId] of Object.entries(users)) {
      if (socketId === socket.id) {
        delete users[userId];
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server and Socket.IO running on port ${PORT}`);
});
