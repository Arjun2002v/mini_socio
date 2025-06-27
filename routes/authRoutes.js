const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const user = require("../Schema/user");

const jwt = require("jsonwebtoken");
require("dotenv").config;

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const isThere = await user.findOne({ username });
  if (isThere) {
    res.send("User Already exist ").sendStatus(201);
  }

  const passHash = bcrypt.hash(password, 10);

  const newUser = new user({ username, password: passHash });
  await newUser.save();

  const token = jwt.sign({
    username: newUser.username,{expiresIn:"24h"}
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const exist = user.findOne({ username });
  if (!exist) {
    res.send("User does not exist,pleae sign up ").sendStatus(201);
  }
});
