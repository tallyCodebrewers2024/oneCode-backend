const express = require("express");
const router = express.Router();

const verifyToken = require("../../middlewares/auth/verifyToken");

const authControllers = require("../../controllers/auth/index");

router.route("/signup").post(authControllers.signup);
router.route("/login").post(authControllers.login);
router.route("/getUser").get(verifyToken(), authControllers.getUser);

module.exports = router;
