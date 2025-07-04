const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const user = require("../Schema/user");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

require("dotenv").config;

router.post("/signup", async (req, res) => {
  const { name, password } = req.body;

  const isThere = await user.findOne({ name });
  if (isThere) {
    res.send("User Already exist ").sendStatus(201);
  } else {
    const passHash = await bcrypt.hash(password, 10);

    const newUser = new user({ name, password: passHash });

    await newUser.save();

    const token = jwt.sign(
      { _id: newUser?._id, name: newUser?.name, avatar: newUser?.avatar },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 1000 });
    res.json({ token }).sendStatus(201);
  }
});

router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const exist = user.findOne({ name });
  if (!exist) {
    res.send("User does not exist,please sign up ").sendStatus(201);
  }
  const pass = await bcrypt.compare(password, user.password);

  if (!pass) {
    res.send("Incorrect password").sendStatus(201);
  }

  //Generate Jwt Token
  const token = jwt.sign({ name: user.name }, { expiresIn: "24h" });

  res.json({ message: "Login Successful", token }).sendStatus(201);
});

router.delete("/flush", async (req, res) => {
  try {
    await mongoose.connection.dropDatabase();
    res.status(200).json({ message: "Database dropped successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to drop database" });
  }
});

module.exports = router;
