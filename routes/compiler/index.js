const express = require("express");
const router = express.Router();

const compilerControllers = require("../../controllers/compiler/index");

router.route('/runcode').post(compilerControllers.runcode);

module.exports = router;