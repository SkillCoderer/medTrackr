const mongoose = require("mongoose");

const mySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNum: {
    type: Number,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    unique: false,
    min: 18,
  },
  pwd: {
    type: String,
    required: true,
    unique: true,
  },
});

const UserDataModel = mongoose.model("userDataModel", mySchema);

module.exports = UserDataModel;
