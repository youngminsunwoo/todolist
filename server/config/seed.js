/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Todo = require('../api/todo/todo.model');
var User = require('../api/user/user.model');

Todo.find({}).remove(function() {
  Todo.create({
    title : 'Learn Some DevOps with Donal and Will',
    completed: true
  }, {
    title : 'Go for Coffee',
    completed: false
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
