var app = angular.module('memory', []);
app.controller('myCtrl', function($scope, $http) {
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
});
