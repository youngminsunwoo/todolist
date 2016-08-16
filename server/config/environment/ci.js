'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/todolist-ci'
  },
  mocks: {
    api: true
  },
  seedDB: true
};
