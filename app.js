const express = require("express");
const mongoose = require("mongoose");
const UserModel = require("./models/userDataModel");
const {
  signupFBUser,
  loginFBUser,
  updateFBUser,
} = require("./utils/FBuserConfig");
require("dotenv").config();

const PORT = process.env.PORT;
const app = express();

mongoose.connect(process.env.connectionString);
app.use(express.json());

// Create User
app.post("/createUser", async (req, res) => {
  const { fullName, email, phoneNum, age, pwd } = req.body;
  try {
    const fbResponse = await signupFBUser(email, pwd);
    console.log(fbResponse, "== fbResponse");
    const dbResponse = await UserModel.create({
      fullName,
      email,
      phoneNum,
      age,
      pwd,
    });
    res.status(201).json({ message: dbResponse });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: err.message });
    console.error("Error during signup:", err.message);
  }
});

// Login User
app.post("/loginUser", async (req, res) => {
  const { email, pwd } = req.body;
  try {
    const loginResponse = await loginFBUser(email, pwd);
    console.log(loginResponse, "== loginResponse");
    res.status(200).json({ message: "User logged in successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
    console.error("Error during login:", err.message);
  }
});

// Update User
app.put("/updateUser", async (req, res) => {
  const { email, fullName, phoneNum, age } = req.body;

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { fullName, phoneNum, age },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

app.listen(PORT, (err) => {
  err
    ? console.warn("Server failed to Start at port:", PORT)
    : console.log("Server Started Successfully at port:", PORT);
});
