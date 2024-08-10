const express = require("express");
const router = express.Router();

const authControllers = require("../../controllers/auth/index");

router.route("/signup", authControllers.signup);
router.route("/login", authControllers.login);

module.exports = router;