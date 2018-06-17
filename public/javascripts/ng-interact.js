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
	    $scope.answers.sort();
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
