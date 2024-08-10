const Problem = require("../../models/Problem");
const { v4: uuidv4 } = require("uuid");

exports.addProblem = async (req, res) => {
	let problemData = req.body.body;

	if (problemData === undefined) {
		return res.status(401).json({ message: "Problem Not Found!" });
	}

	const user = req.user;
	const author = user.id;
	const problemId = uuidv4();

	problemData = JSON.parse(problemData);
	console.log(problemData);

	const modifiedProblemData = {
		...problemData,
		author,
		problemId,
	};

	try {
		const newProb = new Problem(modifiedProblemData);

		await newProb.save();
		// Problem.create(modifiedProblemData);

		return res.status(201).json({ message: "Problem Added Succesfully!" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Error adding problem" });
	}
};

exports.getProblems = async (req, res) => {
	try {
		const problems = await Problem.find();

		return res.status(200).json(problems);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Error fetching problems" });
	}
};

exports.getProblem = async (req, res) => {
  try {
    const { problemId } = req.params;
    const problem = await Problem.findOne({ problemId });

    return res.status(200).json(problem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching problems" });
  }
};
