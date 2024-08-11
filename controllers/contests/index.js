const Contest = require("../../models/Contest");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

exports.addContest = async (req, res) => {
  const user = req.user;
  const author = user.id;
  const contestId = uuidv4();
  const contestData = req.body.formData;
  console.log(contestData);

  if (contestData === undefined) {
    return res.status(401).json({ message: "Contest Not Found!" });
  }
  const problemsList = contestData.problems.map((problem) => {
    return mongoose.Types.ObjectId.isValid(problem)
      ? mongoose.Types.ObjectId(problem)
      : problem;
  });

  console.log(problemsList);

  // const modifiedContestData = {
  //   ...contestData,
  //   author,
  //   contestId,
  //   problems: problemsList,
  // };

  // try {
  //   await Contest.create(modifiedContestData);

  //   return res.status(201).json({ message: "Contest Added Succesfully!" });
  // } catch (error) {
  //   console.log(error);
  //   res.status(500).json({ error: "Error adding contest" });
  // }
};

exports.getContest = async (req, res) => {
  try {
    const { contestId } = req.params;
    const contest = await Contest.findOne({ contestId });
    return res.status(200).json(contest);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching contest" });
  }
};
