'use strict';

var _ = require('lodash');
var Todo = require('./todo.model');

// Get list of todos
exports.index = function(req, res) {
  Todo.find(function (err, todos) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(todos);
  });
};

// Get a single todo
exports.show = function(req, res) {
  Todo.findById(req.params.id, function (err, todo) {
    if(err) { return handleError(res, err); }
    if(!todo) { return res.status(404).send('Not Found'); }
    return res.json(todo);
  });
};

// Creates a new todo in the DB.
exports.create = function(req, res) {
  Todo.create(req.body, function(err, todo) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(todo);
  });
};

// Updates an existing todo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Todo.findById(req.params.id, function (err, todo) {
    if (err) { return handleError(res, err); }
    if(!todo) { return res.status(404).send('Not Found'); }
    var updated = _.merge(todo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(todo);
    });
  });
};

// Deletes a todo from the DB.
exports.destroy = function(req, res) {
  Todo.findById(req.params.id, function (err, todo) {
    if(err) { return handleError(res, err); }
    if(!todo) { return res.status(404).send('Not Found'); }
    todo.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}