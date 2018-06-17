var app = angular.module('memory', []);
app.controller('myCtrl', function($scope, $http) {
    $scope.currentScore = 0;

    // ng controller initialization
    $scope.loadData = function() {
	$scope.currentChoice = ''; // radio currentChoice value
	$scope.isDispFeedback = false;
	$scope.changedVal = '';	// the state of a radio button
	$http.get('/interact').then(function(response){
	    console.log(response.data);
            var questionDisp = response.data;
	    $scope.imageName = questionDisp.imageName;
	    $scope.question = questionDisp.question;
	    $scope.answers = questionDisp.wrongAnswers;
	    $scope.answers.push(questionDisp.rightAnswer);
	    shuffle($scope.answers);
	    $scope.rightAnswer = questionDisp.rightAnswer;
        })
    }
    $scope.loadData();

    // next question button
    $scope.getNextQuestion = function(currentChoice) {
	$scope.loadData();
    }

    // radio currentChoices
    $scope.getVal = function() {
	$scope.currentChoice = $scope.changedVal;
	$scope.isDispFeedback = $scope.currentChoice == '' ? false : true;
	if ($scope.currentChoice == $scope.rightAnswer) {
	    $scope.feedback = "correct";
	    $scope.currentScore++;
	}
	else {
	    $scope.feedback = "wrong";
	}
    }
});

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function userInputHandler() {
    var socket = io('http://192.168.0.100:3000');
    socket.emit('buttons start', {chatroom: 'buttons'});
    socket.on('button load', function(msg){
        console.log(msg.buttonNo);
        if (msg.buttonNo === '1'){
            //0 corresponds to first button from right
            //do something here (ex. move cursor up on the screen, play a video)
	    console.log(msg.buttonNo);
        }
        else if (msg.buttonNo === '2'){
            //1 corresponds to second button from right
            //do something else here
	    console.log(msg.buttonNo);
        }
        else if (msg.buttonNo === '3'){
            //2 corresponds to third button from right
            //do another thing here
	    console.log(msg.buttonNo);
        }
        else if (msg.buttonNo === '4'){
            //3 corresponds to forth button from right
            //do more things here
	    console.log(msg.buttonNo);
        }
        else if (msg.buttonNo === '5'){
            //4 corresponds to fifth button from right
            //do more things here
	    console.log(msg.buttonNo);
        }
    });
    socket.on('button hit', function(msg){
        //the flashing button was hit, yeeeeeaah
        //do something here
        console,log(msg.buttonNo);
    });
}
