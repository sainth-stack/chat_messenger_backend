const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  socketid: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: false
  },
  message: {
    type: Array,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ["Online", "Offline"],
    default: "Online",
  },
}, { timestamps: true });

module.exports = mongoose.model("usersData", Schema);
