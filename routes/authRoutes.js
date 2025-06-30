const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const user = require("../Schema/user");

const jwt = require("jsonwebtoken");
const user = require("../Schema/user");
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

  const token = jwt.sign(
    { username: newUser.username },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 1000 });
  res.send("User created").sendStatus(201);
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const exist = user.findOne({ username });
  if (!exist) {
    res.send("User does not exist,please sign up ").sendStatus(201);
  }
  const pass = await bcrypt.compare(password, user.password);

  if (!pass) {
    res.send("Incorrect password").sendStatus(201);
  }

  //Generate Jwt Token
  const token = jwt.sign({ username: user.username }, { expiresIn: "24h" });

  res.json({ message: "Login Successful", token }).sendStatus(201);
});
