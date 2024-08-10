const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  hashedPwd: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  github: {
    type: String,
    required: true,
  },
  linkedin: {
    type: String,
    required: true,
  },
  submissions: [
    {
      problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
      },
      submittedAt: {
        type: Date,
        required: true,
      },
      status: {
        type: "String",
        required: true,
        enum: [
          "Accepted",
          "Run Time Error",
          "Time Limit Exceeded",
          "Memory Limit Exceeded",
          "Compile Error",
          "Wrong Answer",
        ],
      },
      executionTime: {
        type: "String",
        default: "",
      },
      memoryUsed: {
        type: "String",
        default: "",
      },
    },
  ],
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
  ],
  contests: [
    {
      contest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Contest",
        required: true,
      },
      totalScore: {
        type: String,
        required: true,
      },
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;