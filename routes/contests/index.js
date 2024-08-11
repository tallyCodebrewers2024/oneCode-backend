const express = require("express");
const router = express.Router();

const verifyToken = require("../../middlewares/auth/verifyToken");
const contestControllers = require("../../controllers/contests/index");

router.route("/addContest").post(verifyToken(), contestControllers.addContest);
router.route("/getContest/:contestId").post(contestControllers.getContest);
router.route("/getAllContests").get(contestControllers.getAllContests);

module.exports = router;
