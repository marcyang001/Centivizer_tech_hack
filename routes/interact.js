var express = 	require('express');
var router 	= 	express.Router();


/* GET interaction game. */
router.get('/', function(req, res, next) {
  res.send('respond with interaction');
  res.status(200);
});

module.exports = router;