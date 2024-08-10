const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/auth/verifyToken");

router.use("/auth", require("./auth/index"));
router.use("/compiler", verifyToken, require("./compiler/index"));
router.use("/problems", verifyToken, require("./problems/index"));

module.exports = router;
