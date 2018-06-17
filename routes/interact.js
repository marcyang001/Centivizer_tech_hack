var express = require('express');
var router = express.Router();

/* GET interaction game. */
router.get('/', function(req, res, next) {
    res.send('respond with interaction');
    res.status(200);
});

router.get('/pics', function(req, res, next){
    // var db = req.db;
    // const picsCollection = db.get('pics');
    // picsCollection.find({})
    //  .then(function(docs) {
    //      console.log(docs);
    //      res.json(docs);
    //  });
    var qb = { imageName: "pic2.jpg", tag: "who", question: "Who is this?",
               rightAnswer: "Marc" };
    var qb2 = { imageName: "pic2.jpg", tag: "where", question: "Where is it?",
		rightAnswer: "Thunder Bay" };
    var qb3 = { imageName: "pic2.jpg", tag: "year", question: "What year?",
		rightAnswer: 2000 };
    var qb4 = { imageName: "pic2.jpg", tag: "month", question: "What month?",
	       rightAnswer: 12 };
    var wa = genUserQuestion(qb4);
    res.json(wa);
});

// Generate a question for the Web app front end to use
// @param: questionBase a JSON object of a question from the question bank
//         e.g.
//         { imageName: "pic2.jpg", tag: "who", question: "Who is this?",
//           rightAnswer: "Marc" }
// @return: a user question JSON object
//         e.g.
//         { imageName: "pic2.jpg", question: "Who is this?", rightAnswer: "Marc",
//           wrongAnswers: ["Alice", "Bob", "Cathie"] }
function genUserQuestion(questionBase) {
    var userQuestion = Object.assign({}, questionBase);
    userQuestion.wrongAnswers = genWrongAnswers(questionBase.tag, questionBase.rightAnswer);
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
function genWrongAnswers(tag, rightAnswer) {
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
		j = rightAnswer - 25 + Math.floor(Math.random() * 50);
		cnt++;
            } while (j === rightAnswer && cnt < 1000);

            if (j != rightAnswer) {
		wrongAnswers.push(j);
            } else {
		wrongAnswers.push("----");
            }
	}
	return wrongAnswers;
    }
    else {
	console.alert("wrong question type");
	return [];
    }

    for (var i = 0; i < 3; i++) {
        var j;
        var cnt = 0;
        do {
            j = Math.floor(Math.random() * dict.length);
	    console.log("cnt=" + cnt + ", j=" + j);
            cnt++;
        } while (dict[j] === rightAnswer && cnt < 1000);

        if (dict[j] != rightAnswer) {
            wrongAnswers.push(dict[j]);
        } else {
            wrongAnswers.push("----" + dict[j]);
        }
    }
    return wrongAnswers;
}

module.exports = router;
