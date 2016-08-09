'use strict';

angular.module('todolistApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/todos').success(function(todos) {
      $scope.todos = todos;
    });

    $scope.addThing = function() {
      if($scope.newTodo === '') {
        return;
      }
      $http.post('/api/todos', { name: $scope.newTodo });
      $scope.newTodo = '';
    };

    $scope.deleteThing = function(todo) {
      $http.delete('/api/todos/' + todo._id);
    };
  });
