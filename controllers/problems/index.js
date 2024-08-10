const Problem = require("../../models/Problem");

exports.addProblem = async (req, res) => {
	const problemData = req.body;

	if (problemData === undefined) {
		return res.status(401).json({ message: "Problem Not Found!" });
	}

	try {
		await Problem.create(problemData);

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
