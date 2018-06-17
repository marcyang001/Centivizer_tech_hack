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

		var db = req.db;

		if(err) {
			console.log(err);
			return res.end("Error uploading file.");
		}

		// the information of the photo that user has inputed. 
		var imageInfo = req.body;
		// append the image field to the document
		imageInfo["imageName"] = req.file.originalname;

		// photo collection
		var picCollection = 'pics';
		const collectionPics = db.get(picCollection);

		// question bank collection
		var questionBankCollection = 'questionbank';
		const collectionQBank = db.get(questionBankCollection);


		// insert the image information into collectionPics collection
		collectionPics.insert(imageInfo)
		  .then((docs) => {
		    console.log("INFO: inserted imageInfo for " + docs["imageName"]);
		  }).catch((err) => {
		    console.log(err);
		  });

		// generate questions based on image input (iterate through the keys)
		for (var field in imageInfo) { 
			
			var questionDoc = {};

			if (field !== "questions") {
				
				questionDoc["imageName"] = imageInfo["imageName"];
				questionDoc["tag"] = field;

				if (field === "who") {
					questionDoc["question"] = "Who is this in the photo?";
				}
				else if (field === "where") {

					questionDoc["question"] = "Where is this photo taken?";
				}
				else if (field === "year") {

					questionDoc["question"] = "What year is this photo taken?";
				}
				else if (field === "month") {

					questionDoc["question"] = "What month is this photo taken?";
				}
				else if (field === "imageName") {
					continue;
				}
				
				questionDoc["rightAnswer"] = imageInfo[field];

				// insert the question doc into the question bank
				collectionQBank.insert(questionDoc)
				  .then((docs) => {
				    console.log("INFO: inserted questionDoc for " + docs["imageName"]);
				  }).catch((err) => {
				    console.log(err);
				  });
			}
			else {
				// customized questions
				/* TODO for later */
			}
		} // end of for loop
		
		console.log ("INFO: uploaded a photo");
		res.status(200);
		res.end("File is uploaded");
	});

});


module.exports = router;
