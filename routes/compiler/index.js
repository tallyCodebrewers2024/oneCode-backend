const express = require("express");
const router = express.Router();

const compilerControllers = require("../../controllers/compiler/index");

router.route('/runcode').post(compilerControllers.runcode);
// router.route('/trial').post(compilerControllers.trial);

module.exports = router;