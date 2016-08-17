'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('todolistApp'));

  var MainCtrl,
    scope,
    $httpBackend,
    mockTodos = [
      {
        title: 'Learn Some DevOps with Donal and Will',
        completed: true,
        _id: 0
      }, {
        title: 'Go for Coffee',
        completed: false,
        _id: 1
      }, {
        title: 'Enjoy a cigar in Cuba',
        completed: false,
        _id: 2
      }
    ];

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/todos')
      .respond(mockTodos);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  describe('on page load', function () {
    it('should attach a list of things to the scope', function () {
      $httpBackend.flush();
      expect(scope.todos.length).toBe(3);
    });
    it('should setStatusFilter to all', function () {
      $httpBackend.flush();
      expect(scope.statusFilter).toEqual('all');
    });
  });

  function mockTodo(id, completed) {
    return {_id: id, completed: completed};
  }

  describe('#addTodo', function () {
    beforeEach(function () {
      $httpBackend.expectPOST('/api/todos').respond();
    });
    it('should add the todo', function () {
      scope.addTodo(mockTodo(4, false));
      $httpBackend.flush();
      expect(scope.todos.length).toBe(4);
    });
  });

  describe('#toggleCompleted', function () {
    it('should call PUT api with the new status of completed', function () {
      mockTodos[1].completed = true; // angular will toggle completed for us
      $httpBackend.expectPUT('/api/todos/' + 1, mockTodos[1]).respond({});
      scope.toggleCompleted(mockTodos[1]);
      $httpBackend.flush(); // This invokes the expectPUT from above, and will fail if not as expected.
    });
  });

  describe('#removeTodo',function (){
    beforeEach(function mockingTheDeleteApi(){
      $httpBackend.expectDELETE('/api/todos/' + 1).respond({});
    });
    it('should call the DELETE api for the id of the todo to be deleted',function(){
      scope.removeTodo(mockTodos[1]);
      $httpBackend.flush(); // This invokes the expectDELETE from above, and will fail if not as expected.
    });
    it('should remove the todo from the array after successful response from DELETE api',function(){
      scope.removeTodo(mockTodos[1]);
      $httpBackend.flush();
      expect(scope.todos).toEqual([mockTodos[0],mockTodos[2]]);
    });
  });

  describe('#saveEdits',function(){
    it('should update via the PUT api', function(){
      scope.editTodo(mockTodos[0]); //opens to do for editing

      var updatedTodo = {_id: 0, title: 'Enjoy some nap time whilst Donal and Will talk', completed: true};
      $httpBackend.expectPUT('/api/todos/' + 0, updatedTodo).respond({});

      scope.saveEdits(updatedTodo);
      $httpBackend.flush(); // This invokes the expectPUT from above, and will fail if not as expected.
      // angular scope binding manages the client side model change of the todo, do no need to test here.
    });
    it('should cancel update on blur and saveEvent is submit', function(){
      scope.editTodo(mockTodos[0]); // oepns todo for editing

      var updatedTodo = {_id: 0, title: 'edit', completed: true};
      $httpBackend.expectPUT('/api/todos/' + 0, updatedTodo).respond({});
      scope.saveEvent = 'submit';

      scope.saveEdits(updatedTodo, 'blur');

      expect($httpBackend.flush).toThrow('Unsatisfied requests: PUT /api/todos/0'); // meaning that the PUT request was not made

    });
  });
  describe('#revertEdits',function(){
    it('should revert the todo to the saved copy',function(){
      var mockBackupTodo = {_id: 0, title: 'backed up version', completed: false};
      scope.todoUnderEdit = mockBackupTodo;
      $httpBackend.flush();
      scope.revertEdits(mockTodos[0]);
      expect(scope.todos).toEqual([mockBackupTodo, mockTodos[1], mockTodos[2]]);
    });
  });

  describe('#filterByStatus', function () {
    var mockedTodosToFilter = [mockTodo(1, false), mockTodo(2, false), mockTodo(3, true)];
    it('should return all the todos when status filter is all', function () {
      scope.setStatusFilter('all');
      expect(scope.filterByStatus(mockedTodosToFilter)).toEqual([mockTodo(1, false), mockTodo(2, false), mockTodo(3, true)]);
    });
    it('should return completed todos when status filter is completed', function () {
      scope.setStatusFilter('completed');
      expect(scope.filterByStatus(mockedTodosToFilter)).toEqual([mockTodo(3, true)]);
    });
    it('should return not completed todos when status filter is active', function () {
      scope.setStatusFilter('active');
      expect(scope.filterByStatus(mockedTodosToFilter)).toEqual([mockTodo(1, false), mockTodo(2, false)]);
    });
  });

});