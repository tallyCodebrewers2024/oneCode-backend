const express = require("express");
const router = express.Router();

const contestControllers = require("../../controllers/contests/index");

router.route("/addContest").post(contestControllers.addContest);
router.route("/getContest/:contestId").post(contestControllers.getContest);

module.exports = router;
