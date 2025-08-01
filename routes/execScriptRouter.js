const express = require('express');
const execScriptRoute = express.Router();
const {executeScript} = require('../controllers/execScript')

execScriptRoute.post('/execScript',executeScript);

module.exports = execScriptRoute