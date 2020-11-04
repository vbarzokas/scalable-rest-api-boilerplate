const config = require('./lib/config');
const db = require('./lib/db');
const server = require('./lib/server');
const logger = require('./lib/logger');

async function init() {
  logger.create();

  await db.connect(config.mongo);
  await server.start(config.http);
}

init();
