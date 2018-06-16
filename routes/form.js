var express = 	require('express');
var router 	= 	express.Router();
var multer	=	require('multer');

var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var upload = multer({ storage : storage});


/* GET form. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  res.status(200);
});

router.post('/generate', function(req, res, next) {
	
	


});


module.exports = router;
