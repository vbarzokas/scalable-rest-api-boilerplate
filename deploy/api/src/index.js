const bunyan = require('bunyan');

const config = require('./lib/config');
const DB = require('./lib/db');
const Server = require('./lib/server');

async function init () {
  const logger = bunyan.createLogger({ name: 'Sample-Order-System-API' });

  const db = new DB(config.mongo, logger);
  await db.connect();

  const server = new Server(config.http, logger, db);
  await server.start();
}

init();
