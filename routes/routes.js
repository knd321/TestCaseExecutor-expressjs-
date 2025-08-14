const express = require('express')

const router = express.Router();
const execScriptRoute = require('./execScriptRouter');
router.use('/exec',execScriptRoute);


router.get('/checking',(req, res) => {
    console.log("just checking if it's working");
    res.status(200).send({message: "checking if it's working"});
});
 
module.exports = router;
 