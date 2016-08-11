'use strict';

angular.module('todolistApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.addTodo = function () {
      if ($scope.newTodo === '') {
        return;
      }
      $http.post('/api/todos', {title: $scope.newTodo, completed: false}).success(function (todo) {
        $scope.todos.push(todo);
      });
      $scope.newTodo = '';
    };

    $scope.toggleCompleted = function (todo) {
      // the completed state has been toggled by angular already
      if (!todo) {
        return;
      }
      $http.put('/api/todos/' + todo._id, todo);
    };

    $scope.removeTodo = function (todo) {
      if (!todo) {
        console.warn('no todo provided');
        return;
      }
      $http.delete('/api/todos/' + todo._id).success(function () {
        var i = -1;
        $scope.todos.some(function(t,ind){
          if (t._id === todo._id) {
            i = ind;
            return true; // breaks the some loop
          }
        });
        if (i > -1) {
          $scope.todos.splice(i, 1);
        }
      });
    };

    $scope.editTodo = function (todo) {
      $scope.editedTodo = todo;
      $scope.todoUnderEdit = angular.extend({}, todo);
    };

    $scope.saveEdits = function (todo, event) {
      // Blur events are automatically triggered after the form submit event.
      // This does some unfortunate logic handling to prevent saving twice.
      if (event === 'blur' && $scope.saveEvent === 'submit') {
        $scope.saveEvent = null;
        return;
      }

      $scope.saveEvent = event;

      if ($scope.reverted) {
        $scope.reverted = null;
        return;
      }

      todo.title = todo.title.trim();

      // no need to save todo
      if (todo.title === $scope.todoUnderEdit.title) {
        $scope.editedTodo = null;
        return;
      }

      $http.put('/api/todos/' + todo._id, todo)
        .finally(function () {
          $scope.editedTodo = null;
        });
    };

    $scope.revertEdits = function (todo) {
      var i = -1;

      $scope.todos.some(function(t,ind){
        if (t._id === todo._id) {
          i = ind;
          return true; // breaks the some loop
        }
      });

      if (i > -1) {
        $scope.todos[i] = $scope.todoUnderEdit;
      }
      $scope.editedTodo = null;
      $scope.todoUnderEdit = null;
      $scope.reverted = true;
    };

    $scope.filterByStatus = function (todos) {
      var filtererTodos = todos.filter(function(todo){
        if ($scope.statusFilter === 'all') {
          return true;
        }
        if ($scope.statusFilter === 'completed' && todo.completed) {
          return true;
        }
        if ($scope.statusFilter === 'active' && !todo.completed) {
          return true;
        }
      });
      return filtererTodos;
    };

    $scope.setStatusFilter = function (newStatus) {
      $scope.statusFilter = newStatus === 'all' || newStatus === 'completed' || newStatus === 'active' ? newStatus : 'all';
    };

    $scope.todos = [];
    $scope.setStatusFilter('all');
    $scope.loadingTodos = true;
    $http.get('/api/todos').success(function (todos) {
      $scope.todos = todos;
      $scope.loadingTodos = false;
    });

  });
