var express = 	require('express');
var router 	= 	express.Router();
var multer	=	require('multer');
var csv = require('fast-csv');
var fs = require('fs');
var bodyParser = require('body-parser');



router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


var imageStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/images');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

var csvStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/csv');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});



var uploadImage = multer({ storage: imageStorage }).single("userPhoto");

var uploadCSV = multer({ storage: csvStorage }).single("userCSV");


// photo collection
var picCollection = 'pics';
// question bank collection
var questionBankCollection = 'questionbank';




/* GET form. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  res.status(200);
});

router.post('/generate', function(req, res, next) {
	
	uploadImage(req,res,function(err) {

		var db = req.db;

		if(err) {
			console.log(err);
			return res.end("Error uploading file.");
		}

		// the information of the photo that user has inputed. 
		var imageInfo = req.body;


		// http://localhost:3000/images/imageName.jpg/
		var fullImageUrl = req.protocol + '://' + req.get('host') + "/images/" +req.file.originalname;

		console.log("full image url: " + fullImageUrl);

		// append the image url field to the document
		imageInfo["imageUrl"] = fullImageUrl;

		

		const collectionPics = db.get(picCollection);
		const collectionQBank = db.get(questionBankCollection);

		// insert the image information into collectionPics collection
		collectionPics.insert(imageInfo)
		  .then((docs) => {
		    console.log("INFO: inserted imageInfo for " + docs["imageUrl"]);
		  }).catch((err) => {
		    console.log(err);
		  });

		// generate a list of questions from the image information 
		var listOfQuestions = generateQuestionDocs(imageInfo);

		// insert questions into the MongoDB questionbank collection
		listOfQuestions.map(function(questionDoc) {

			// insert the question doc into the question bank
			collectionQBank.insert(questionDoc)
				.then((docs) => {
				   console.log("INFO: inserted questionDoc for " + docs["imageUrl"]);
				}).catch((err) => {
				  console.log(err);
				});
		});
		

		console.log ("INFO: uploaded a photo");
		res.status(200);
		res.end("File is uploaded");
	});

});


router.post('/uploadcsv', function(req, res, next) {


	uploadCSV(req, res, function(err) {

		var db = req.db;
		
		if(err) {
			console.log(err);
			return res.end("Error uploading csv file.");
		}


		var fileDest = "./public/csv/";
		var fileName = req.file.originalname;
		var fileFullPath = fileDest + fileName;

		var stream = fs.createReadStream(fileFullPath);
		
		var csvStream = csv
    		.parse({ headers : true})
    		.on("data", function(csvRow){
    			
    			// parse into a json object and store into mongoDB
    			var imageInfo = {};

    			imageInfo["imageUrl"] = csvRow["imageUrl"];
    			imageInfo["who"] = csvRow["who"];
    			imageInfo["where"] = csvRow["where"];
    			imageInfo["year"] = csvRow["year"];
    			imageInfo["month"] = csvRow["month"];


    			/* TODO for customized questions */ 
    			//								 //
    			//								 //
    			//								 //
    			///////////////////////////////////

    			const collectionPics = db.get(picCollection);
				const collectionQBank = db.get(questionBankCollection);

    			// insert the image information into pics collection of MongoDB
				collectionPics.insert(imageInfo)
				  .then((docs) => {
				    console.log("INFO: inserted imageInfo for " + docs["imageUrl"]);
				  }).catch((err) => {
				    console.log(err);
				  });

				var listOfQuestions = generateQuestionDocs(imageInfo);

				// insert questions into the MongoDB questionbank collection
				listOfQuestions.map(function(questionDoc) {

				// insert the question doc into the question bank
				collectionQBank.insert(questionDoc)
					.then((docs) => {
				   		console.log("INFO: inserted questionDoc for " + docs["imageUrl"]);
					}).catch((err) => {
				  		console.log(err);
					});
				});
		
    		})
    		.on("end", function(){

         		//delete the uploaded csv file
         		fs.unlinkSync(fileFullPath);


         		console.log ("INFO: uploaded a CSV file");
				res.status(200);
				res.end("CSV file is uploaded");


    		});
 		
		stream.pipe(csvStream);

	});


});


function generateQuestionDocs(imageInfo) {

	var resultQuestionDocs = [];
	// generate questions based on image input (iterate through the keys)
	for (var field in imageInfo) { 
			
		var questionDoc = {};

		if (field != "questions") {
				
			questionDoc["imageUrl"] = imageInfo["imageUrl"];
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
			else if (field === "imageUrl") {
				continue;
			}
				
			questionDoc["rightAnswer"] = imageInfo[field];

			resultQuestionDocs.push(questionDoc);
		}
		else {
			// customized questions
			/* TODO for later */
		}
	} // end of for loop

	return resultQuestionDocs;
}


module.exports = router;
