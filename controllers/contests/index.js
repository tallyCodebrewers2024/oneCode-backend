const Contest = require("../../models/contest");

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
