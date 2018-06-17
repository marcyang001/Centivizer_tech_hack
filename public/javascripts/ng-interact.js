var app = angular.module('memory', []);
app.controller('myCtrl', function($scope) {
    $scope.answers = ["Bob", "Alice", "Darren", "Marc"];
    $scope.imageName = 'pic2.jpg';
    $scope.question = "Question: What's your Name?";
});
