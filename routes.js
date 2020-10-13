const express = require("express");
const router = express();
const controllers = require('./controllers/controllers')

router.get('/', controllers.controllers)

module.exports = router;