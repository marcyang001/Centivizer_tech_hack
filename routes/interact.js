var express = require('express');
var router = express.Router();

/* GET interaction game. */
router.get('/', function(req, res, next) {
    var db = req.db;
    // photo collection
    var picCollection = 'pics';
    var questionCollection = 'questionbank';
    const collectionPics = db.get(picCollection);
    const collectionQuestions = db.get(questionCollection);

    //collectionQuestions.findOne({tag:other}).then(user=>{
    //       console.log(user.question);
//
   // })
    //console.log(collectionQuestions.findOne({tag:other}));
    // a picture document in the database is like this:
    // { "_id" : ObjectId("5b25ba1fbd569f641f01421d"),
    //   "who" : "volvo",
    //   "month" : "2",
    //   "where" : "Montreal",
    //   "year" : "2018",
    //   "imageName" : "pic2.jpg" }

    // a picture question in the database is like this:
    // { "_id" : ObjectId("5b25ba1fbd569f641f014221"),
    //   "imageName" : "pic2.jpg",
    //   "tag" : "year",
    //   "question" : "What year is this photo taken?",
    //   "rightAnswer" : "2018" }

    collectionPics.count({})
	.then((num) => {
        var randNumber = parseInt((Math.random() * num + 1));
        collectionPics.find({})
		    .then((docs) => {
		          var selectedImageUrl = docs[randNumber-1]["imageUrl"];
		          collectionQuestions.count({ "imageUrl": selectedImageUrl })
			     .then((questionCnt) => {
			        var qi = parseInt((Math.random() * questionCnt));
			        collectionQuestions.find({ "imageUrl": selectedImageUrl })
				    .then((docsObj) => {
				        var doc = docsObj[qi];
                        //console.
				        var questionDisplay = genUserQuestion(doc);

                        res.json(questionDisplay);
				        res.status(200);
				    });
			     }).catch((err) => { 
                    });
		}).catch((err) => {
		    console.log(err);
		  });
	}).catch((err) => {
            console.log(err);
	   });
});

router.get('/pics', function(req, res, next){
    res.status(200);
});

// Generate a question for the Web app front end to use
// @param: questionBase a JSON object of a question from the question bank
//         e.g.
//         { imageName: "pic2.jpg", tag: "who", question: "Who is this?",
//           rightAnswer: "Marc" }
// @return: a user question JSON object
//         e.g.
//         { imageName: "pic2.jpg", tag: "who", question: "Who is this?",
//           rightAnswer: "Marc",
//           wrongAnswers: ["Alice", "Bob", "Cathie"] }
function genUserQuestion(questionBase) {
    var userQuestion = Object.assign({}, questionBase);
    userQuestion.wrongAnswers = genWrongAnswers(questionBase);
    // console.log(questionBase);
    return userQuestion;
}

const nameBank = ["Alice", "Bob", "Cathie", "David", "Edward", "Ford",
                  "Greg", "Hilbert", "Icelyn", "Jaimie", "Kate", "Lara",
                  "Mandi", "Nancy", "Odin", "Pascal", "Queeny", "Random",
                  "Sam", "Tag", "Udele", "Valencia", "Wendelin", "Xyleena",
                  "Yalgonata", "Zaliki"];
const placeBank = ["Edmonton", "Victoria", "Winnipeg", "Fredericton",
                   "St. John's", "Halifax", "Toronto", "Charlottetown",
                   "Quebec City", "Regina", "Yellowknife", "Iqaluit",
                   "Whitehorse"];
var yearBank = [];
const monthBank = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// wrongAnswer_array <- question_tag, right_answer
function genWrongAnswers(questionBase) {
    var tag=questionBase.tag;
    var rightAnswer=questionBase.rightAnswer;

    var wrongAnswers = [];
    var dict = null;
    if (tag === "who") {
        dict = nameBank;
    }
    else if (tag === "where") {
        dict = placeBank;
    }
    else if (tag === "month") {
        dict = monthBank;
    }
    else if (tag === "year") {
        for (var i = 0; i < 3; i++) {
            var j;
            var cnt = 0;
            do {
                j = rightAnswer - Math.floor(Math.random() * 10);
                cnt++;
		console.log("i=" + i + ", cnt=" + cnt + ", j=" + j);
            } while ((j == rightAnswer || findEntry(j, wrongAnswers) == true) && cnt < 1000);
	    // use == instead of === to compare a number and a number string, e.g. 2 == "2" is true

            if (j != rightAnswer) {
                wrongAnswers.push(j);
            } else {
                wrongAnswers.push("----");
            }
        }
        return wrongAnswers;
    }else if (tag === "other") {

        wrongAnswers.push(questionBase.wrongAnswers[0]);
        wrongAnswers.push(questionBase.wrongAnswers[1]);
        wrongAnswers.push(questionBase.wrongAnswers[2]);
        console.log(wrongAnswers);
        return wrongAnswers;
    }
    else {
        console.log("wrong question type");
        return [];
    }
    // three wrong answers 
    for (var i = 0; i < 3; i++) {
        var j;
        var cnt = 0;
        do {
            j = Math.floor(Math.random() * dict.length);
            cnt++;
            console.log("i=" + i + ", cnt=" + cnt + ", j=" + j);
        } while ((dict[j] == rightAnswer || findEntry(dict[j], wrongAnswers) == true) && cnt < 1000);
	// use == instead of === to compare a number and a number string, e.g. 2 == "2" is true

        if (dict[j] != rightAnswer) {
            wrongAnswers.push(dict[j]);
        } else {
            wrongAnswers.push("----" + dict[j]);
        }
    }
    return wrongAnswers;
}

function findEntry(item, array) {
    var result = false;
    for (var i = 0; i < array.length; i++) {
	if (item == array) {
	    result = true;
	    return result;
	}
    }
    console.log(item + ' : ' + array + ' = ' + result);
    return result;
}

module.exports = router;
