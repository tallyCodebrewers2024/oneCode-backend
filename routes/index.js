const express = require("express");
const router = express.Router();

router.use("/compiler", require("./compiler/index"));
router.use("/problems", require("./problems/index"));

module.exports = router;
