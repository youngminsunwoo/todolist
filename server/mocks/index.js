// This is for the purpose of mocking the mongoose module methods so as to mock the mongo backend
module.exports = {
  mockMongo: function(){
    if (process.env.NODE_ENV === 'development') {
      var proxyquire = require('proxyquire');
      proxyquire('../api/todo/todo.controller', {
        './todo.model': {
          findById: function (id, callback) {
            console.info('stubbed: findById');

            // mock the remove method from the returned to do
            function MockTodo(id, title, completed){
              this._id = id;
              this.title = title;
              this.completed = completed;
            }
            MockTodo.prototype.remove = function(callback){
              callback(null);
            };
            var todo = new MockTodo(id, 'something I found', false);
            callback(null,todo);
          },
          find: function (callback) {
            console.info('stubbed: find')
            callback(null, [{title: 'hello', _id: 'abcdef1234567890abcdef12', completed: false}, {title: 'hello again', _id: 'abcdef1234567890abcdef13', completed: false}]);
          },
          create: function (todo, callback) {
            console.info('stubbed: create')
            callback(null, todo)
          },
          remove: function (callback) {
            callback(null);
          }
        }
      });
    }
  }
}
