var express = 	require('express');
var router 	= 	express.Router();
var multer	=	require('multer');
var csv = require('fast-csv');
var fs = require('fs');
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', function(req, res, next) {
    //res.send('respond with a resource');
    var question;
    var db = req.db;

    var picCollection = 'pics';
    var questionCollection = 'questionbank';
    const collectionPics = db.get(picCollection);
    const collectionQuestions = db.get(questionCollection);

    /*collectionPics.count({})
        .then((num) => {
            var randNumber = parseInt((Math.random() * num + 1));
            collectionPics.find({})
                .then((docs) => {
                    var selectedImageUrl = docs[randNumber-1]["imageUrl"];
                    collectionQuestions.count({ "imageUrl": selectedImageUrl })
                        .then((questionCnt) => { */
                            //var qi = parseInt((Math.random() * questionCnt));

                            collectionQuestions.find()
                                .then((docsObj) => {
                                    console.log(docsObj)
                                    var doc = docsObj;
                                    res.json(doc);
                                    //var questionDisplay = genUserQuestion(doc);



                                    //res.json(questionDisplay);
                           /*         res.status(200);
                                });
                        }).catch((err) => {
                    });
                }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
        console.log(err); */
    });

});

var imageStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/images');
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

var uploadImage = multer({ storage: imageStorage }).single("userPhoto");


router.post('/', function(req, res, next){

    uploadImage(req,res,function(err) {

        var fullImageUrl = req.protocol + '://' + req.get('host') + "/images/" +req.file.originalname;


    console.log(req.body);
    console.log(req.body.firstAEdit);
    var db = req.db;
    var picCollection = 'pics';
    var questionCollection = 'questionbank';
    const collectionPics = db.get(picCollection);
    const collectionQuestions = db.get(questionCollection);
    collectionQuestions.update({"tag":"year"},{$set:{"rightAnswer":req.body.year,"imageUrl":fullImageUrl}},false,false);
    collectionQuestions.update({"tag":"who"},{$set:{"rightAnswer":req.body.who,"imageUrl":fullImageUrl}},false,false);
    collectionQuestions.update({"tag":"where"},{$set:{"rightAnswer":req.body.where,"imageUrl":fullImageUrl}},false,false);
    collectionQuestions.update({"tag":"month"},{$set:{"rightAnswer":req.body.month,"imageUrl":fullImageUrl}},false,false);

        collectionPics.find({})
            .then((docs) => {

                console.log(docs);
                collectionPics.update({"imageUrl":docs[0].imageUrl},{$set:{"imageUrl" : fullImageUrl}},false,false)
            })

    //collectionPics.update({"tag":"all"},{$set:{"imageUrl":fullImageUrl}},false,false);
    var myquery = { tag: "other" };
    var newvalues = {
        rightAnswer: req.body.RightAEdit,
        tag:"other",
        question:req.body.custom,
        imageUrl:fullImageUrl,
        wrongAnswers:[ req.body.firstAEdit, req.body.secondAEdit, req.body.thirdAEdit]
    };

    collectionQuestions.findOneAndUpdate(myquery, newvalues).then((updatedDoc) => {
        //if (err) console.log(err); //throw err;
        db.close();
    });
    res.status(200);
    res.end("Edit Succeed!");
    /*

    collectionPics.count({})
        .then((num) => {
            var randNumber = parseInt((Math.random() * num + 1));
            collectionPics.find({})
                .then((docs) => {
                    var selectedImageUrl = docs[randNumber-1]["imageUrl"];
                    collectionQuestions.count({ "imageUrl": selectedImageUrl })
                        .then((questionCnt) => {
                            //var qi = parseInt((Math.random() * questionCnt));
                            collectionQuestions.find({ "imageUrl": selectedImageUrl })
                                .then((docsObj) => {
                                    //console.log(docsObj[4].imageUrl)
                                    var doc = docsObj[4];
                                    //var questionDisplay = genUserQuestion(doc);

                                    var myquery = { tag: "other" };
                                    var newvalues = { rightAnswer: req.body.RightAEdit,
                                        tag:"other",
                                        question:req.body.custom,
                                        imageUrl:docsObj[4].imageUrl,
                                        wrongAnswers:[ req.body.firstAEdit, req.body.secondAEdit, req.body.thirdAEdit]
                                    };

                                    collectionQuestions.findOneAndUpdate(myquery, newvalues).then((updatedDoc) => {
                                        //if (err) console.log(err); //throw err;
                                        db.close();
                                    });

                                });
                        }).catch((err) => {
                    });
                }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
        console.log(err);
    });
    res.status(200);
    res.end("Edit Succeed!");
    */
    });
});
/*
router.put('/',function(req,res,next){
    console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
    console.log(req.body.custom);
    console.log(req.body.firstAEdit);
    console.log(req.body.secondAEdit);
    console.log(req.body.thirdAEdit);
    console.log(req.body.RightAEdit);
    //res.send(res.body);
    var db = req.db;
    var questionCollection = 'questionbank';
    const collectionQuestions = db.get(questionCollection);
    collectionQuestions.findOne({tag:other}).then(user=> {
        user.question=req.body.custom;
        user.save();
    });
})
*/
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
    /*
    Category.findOne({_id:req.params.id}).then(categora=>{

        categora.name =req.body.name;
        categora.save().then(savedCategory=>{
            res.redirect('/admin/categories');
        })


    });
    */

module.exports = router;