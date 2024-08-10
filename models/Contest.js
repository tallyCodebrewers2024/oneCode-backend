const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  contestId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  division: {
    type: Number,
    required: true,
    enum: [1, 2, 3, 4],
  },
  contestProblems: [
    {
      problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
    },
  ],
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  writeUp: {
    type: String,
    default: "",
  },
  standings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      totalScore: {
        type: Number,
        required: true,
      },
    },
  ],
  authors: [
    {
      type: String,
      required: true,
    },
  ],
});

const Contest =
  mongoose.models.Contest || mongoose.model("Contest", contestSchema);
module.exports = Contest;
