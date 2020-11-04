const bunyan = require('bunyan');

let instance;

function create() {
  instance = bunyan.createLogger({ name: 'Sample-Order-System-API' });

  return instance;
}

function getInstance() {
  return instance;
}

module.exports = {
  create,
  getInstance
};
