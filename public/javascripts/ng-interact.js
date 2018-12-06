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
	    $scope.imageUrl = questionDisp.imageUrl;
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
