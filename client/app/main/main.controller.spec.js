'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('todolistApp'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/todos')
      .respond([
        {
          title : 'Learn Some DevOps with Donal and Will',
          completed: true
        }, {
          title : 'Go for Coffee',
          completed: false
        }
      ]);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of things to the scope', function () {
    $httpBackend.flush();
    expect(scope.todos.length).toBe(2);
  });
});
