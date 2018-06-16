var express = 	require('express');
var router 	= 	express.Router();
var multer	=	require('multer');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage: storage }).single("userPhoto");



/* GET form. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  res.status(200);
});

router.post('/generate', function(req, res, next) {
	
	upload(req,res,function(err) {

		if(err) {
			console.log(err);
			return res.end("Error uploading file.");
		}

		var mongoDoc = req.body;
		mongoDoc['image'] = req.file.originalname;

		console.log(mongoDoc);
		
		console.log ("uploaded a photo");
		res.status(200);
		res.end("File is uploaded");
	});

});


module.exports = router;
