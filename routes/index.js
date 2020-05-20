var express = require('express');
var router = express.Router();
var empStatusController = require("../controller/empStatusController")
/* post  users listing. */
router.post('/', empStatusController.userStatus);
module.exports = router;
