const express = require("express");
const router = express.Router();

const verifyToken = require("../../middlewares/auth/verifyToken");
const problemControllers = require("../../controllers/problems/index");

router.route("/addProblem").post(verifyToken(), problemControllers.addProblem);
router.route("/getProblems").get(problemControllers.getProblems);
router.route("/getProblem/:problemId").get(problemControllers.getProblem);

module.exports = router;
