const Contest = require("../../models/Contest");

exports.addContest = async (req, res) => {
  const contestData = req.body;

  if (contestData === undefined) {
    return res.status(401).json({ message: "Contest Not Found!" });
  }

  try {
    await Contest.create(contestData);

    return res.status(201).json({ message: "Contest Added Succesfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error adding contest" });
  }
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
