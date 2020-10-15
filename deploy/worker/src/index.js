const bunyan = require('bunyan');

const config = require('./lib/config');
const DB = require('./lib/db');
const Worker = require('./lib/worker');

async function init () {
  const logger = bunyan.createLogger({ name: 'Sample-Order-System-Worker' });

  const db = new DB(config.mongo, logger);
  await db.connect();

  const worker = new Worker(config.worker, logger, db);
  await worker.start();
}

init();
