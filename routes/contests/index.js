const express = require("express");
const router = express.Router();

const verifyToken = require("../../middlewares/auth/verifyToken");
const contestControllers = require("../../controllers/contests/index");

router.route("/addContest").post(verifyToken(), contestControllers.addContest);
router.route("/getContest/:contestId").get(contestControllers.getContest);

module.exports = router;
