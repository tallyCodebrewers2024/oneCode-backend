const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth/index"));
router.use("/compiler", require("./compiler/index"));
router.use("/problems", require("./problems/index"));
router.use("/contests", require("./contests/index"));

module.exports = router;
