const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const HistoryModel = require("./historySchema");

const app = express();

const port = 5000;

const url = "mongodb://localhost:27017/io";

app.use(cors({ origin: "*" }));
app.use(express.json());

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error =>", error);
  });

const isStrongPassword = (password) => {
  // password length 6 and 20 characters
  if (password.length < 6 || password.length > 20) {
    return false;
  }

  // password one lowercase letter, one uppercase letter, and one digit
  if (
    !/[a-z]/.test(password) ||
    !/[A-Z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return false;
  }

  // password not contain three same characters
  for (let i = 0; i < password.length - 2; i++) {
    if (
      password[i] === password[i + 1] &&
      password[i + 1] === password[i + 2]
    ) {
      return false;
    }
  }

  return true;
};

const validateInput = (password) => {
  let count = 0;

  // check if password is already strong
  if (isStrongPassword(password)) {
    return 0;
  }

  // insert one character
  if (password.length < 6) {
    count += 6 - password.length;
  }

  // delete one character
  if (password.length > 20) {
    count += password.length - 20;
  }

  // replace one character with another character
  if (!/[a-z]/.test(password)) {
    count++;
  }
  if (!/[A-Z]/.test(password)) {
    count++;
  }
  if (!/\d/.test(password)) {
    count++;
  }
  //continues three charater
  for (let i = 0; i < password.length - 2; i++) {
    if (
      password[i] === password[i + 1] &&
      password[i + 1] === password[i + 2]
    ) {
      count++;
      break;
    }
  }
  return count;
};

app.get("/io", async (req, res) => {
  try {
    const historys = await HistoryModel.find().sort({ created_at: -1 });
    res.json(historys);
  } catch (error) {
    console.error("Error =>", error);
    res.status(500).json({ error });
  }
});
app.post("/io", async (req, res) => {
  try {
    const output = validateInput(req.body.inputVal);
    const newHistory = new HistoryModel({ input: req.body.inputVal, output });
    const result = await newHistory.save();
    res.status(201).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// listen the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
