const Problem = require("../../models/Problem");
const { v4: uuidv4 } = require("uuid");

exports.addProblem = async (req, res) => {
    let problemData = req.body;

    if (problemData === undefined) {
        return res.status(401).json({ message: "Problem Not Found!" });
    }
    const user = req.user;
    const author = user.id;
    const problemId = uuidv4();

    problemData = JSON.parse(problemData);

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
    res.status(500).json({ error: "Error fetching problem" });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findById({ _id: id });
    return res.status(200).json(problem);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error fetching problem" });
  }
};

// exports.getTestCases = async (req, res) => {
//     const { problemId } = req.params;

//     try {
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             error: "Err",
//         });
//     }
// };

// exports.submitCode = async (req, res) => {
//     const { problemId } = req.params;

//     const { language, code, problem } = req.body;

//     try {
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message: "Unable to submit code!",
//         });
//     }
// };
