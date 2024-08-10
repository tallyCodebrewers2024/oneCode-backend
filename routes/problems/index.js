const express = require("express");
const router = express.Router();

const problemControllers = require("../../controllers/problems/index");

router.route("/addProblem").post(problemControllers.addProblem);

module.exports = router;
