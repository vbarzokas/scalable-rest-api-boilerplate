const mongoose = require('mongoose');
const mongooseAutoIncrement = require('mongoose-auto-increment');

const orderSchema = require('./schemas/order');
const productSchema = require('./schemas/product');
const stastisticsSchema = require('./schemas/statistics');

const logger = require('../logger');
const ERRORS = require('../constants/errors');

const models = {};

/**
 * Creates the DB abstraction layer for communicating with MongoDB and initiates the connection.
 *
 * @method connect
 * @param {Object} config Configuration object with structure:
 *
 *  {
 *    host: <String> The target MongoDB host to use.
 *    port: <Number> The target MongoDB port to use.
 *    database: <String> The target MongoDB database name to use.
 *    replicaSet: <String> The target MongoDB replica set name to use.
 *  }
 * @returns {Boolean} True if it succeeds.
 */
async function connect(config) {
  const log = logger.getInstance();
  let uri = `mongodb://${config.uri}/${config.database}`;

  if (config.replicaSet !== '') {
    uri = uri + `?replicaSet=${config.replicaSet}`;
  }

  try {
    await mongoose.connect(uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    );
  } catch (error) {
    log.error('Initial DB connection error: ', {
      errorCode: ERRORS.DB.INTERNAL_ERROR,
      error: error
    });
  }

  log.info('MongoDB database connection created successfully');
  const connection = mongoose.connection;

  connection
    .on('all', () => {
      log.info(`Connected to all nodes of the replica set ${uri}`);
    })
    .on('error', (error) => {
      logger.error('General DB connection error: ', {
        errorCode: ERRORS.DB.INTERNAL_ERROR,
        error: error
      });
    })
    .on('disconnected', () => {
      log.error('DB disconnected.', {
        errorCode: ERRORS.DB.CONNECTION_ERROR
      });
    });

  mountModels(connection);

  return true;
}

/**
 * Mounts the available Mongoose ODM models and wraps them in a custom object for easier access.
 *
 * @function mountModels
 * @param {Object} connection
 * @returns {Boolean} True once all the models have been mounted.
 */
function mountModels(connection) {
  mongooseAutoIncrement.initialize(connection);

  orderSchema.plugin(mongooseAutoIncrement.plugin, { model: 'Order', startAt: 1 });
  productSchema.plugin(mongooseAutoIncrement.plugin, { model: 'Product', startAt: 1 });

  models.Order = connection.model('Order', orderSchema);
  models.Product = connection.model('Product', productSchema);
  models.Statistics = connection.model('Statistics', stastisticsSchema);

  return true;
}

/**
 * @function getModel
 * @param {String} modelName
 * @returns {Object}
 */
function getModel(modelName) {
  return models[modelName];
}

module.exports = {
  connect,
  getModel
};
