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
    var wa = genUserQuestion(qb);
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
    var wrongAnswers = [];
    switch (questionBase.tag) {
    case "who":
        const nameBank = ["Alice", "Bob", "Cathie", "David", "Edward", "Ford",
                          "Greg", "Hilbert", "Icelyn", "Jaimie", "Kate", "Lara",
                          "Mandi", "Nancy", "Odin", "Pascal", "Queeny", "Random",
                          "Sam", "Tag", "Udele", "Valencia", "Wendelin", "Xyleena",
                          "Yalgonata", "Zaliki"];
        for (var i = 0; i < 3; i++) {
            var j;
            var cnt = 0;
            do {
                j = Math.floor(Math.random() * nameBank.length);
                cnt++;
            } while (nameBank[j] === questionBase.rightAnswer && cnt < 26);

            if (nameBank[j] != questionBase.rightAnswer) {
                wrongAnswers.push(nameBank[j]);
            } else {
                wrongAnswers.push("----");
            }
        }
        userQuestion.wrongAnswers = wrongAnswers;
        break;
    case "where":
        break;
    case "year":
        break;
    case "month":
        break;
    case "other":
        break;
    default:
        break;
    }
    console.log(questionBase);
    return userQuestion;
}

module.exports = router;
