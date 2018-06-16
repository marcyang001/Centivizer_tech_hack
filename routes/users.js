var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("enter here");
  res.send('respond with a resource');
  res.status(200);
});

module.exports = router;
