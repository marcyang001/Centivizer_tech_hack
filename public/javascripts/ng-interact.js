var app = angular.module('memory', []);
app.controller('myCtrl', function($scope, $http) {
    // ng controller initialization
    $scope.loadData = function() {
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
    $scope.choice='';		// radio choice value
    $scope.isDispFeedback = false;

    // next question button
    $scope.getNextQuestion = function(choice) {
	console.log('getNextQuestion');
    }

    // radio choices
    $scope.getVal = function() {
	$scope.choice = $scope.changedVal;
	$scope.isDispFeedback = $scope.choice == '' ? false : true;
	if ($scope.choice == $scope.rightAnswer) {
	    $scope.feedback = "correct";
	}
	else {
	    $scope.feedback = "wrong";
	}
    }
});
