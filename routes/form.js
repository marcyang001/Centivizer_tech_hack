var express = 	require('express');
var router 	= 	express.Router();
var multer	=	require('multer');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  res.status(200);
});

router.post('/generate', function(req, res, next) {

	


});


module.exports = router;
