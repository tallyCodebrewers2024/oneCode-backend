const express = require("express");
const router = express.Router();

const contestControllers = require("../../controllers/contests/index");

router.route("/addContest").post(contestControllers.addContest);

module.exports = router;
