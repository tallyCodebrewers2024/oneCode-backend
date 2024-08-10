const connectToMongoDB = require("../../db");
const Problem = require("../../models/problem");

exports.addProblem = async (req, res) => {
  const problemData = req.body;

  if (problemData === undefined) {
    return res.status(401).json({ message: "Problem Not Found!" });
  }

  try {
    await connectToMongoDB();
    await Problem.create(problemData);

    return res.status(201).json({ message: "Problem Added Succesfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error adding problem" });
  }
};
