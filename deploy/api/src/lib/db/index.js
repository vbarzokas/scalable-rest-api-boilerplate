const mongoose = require('mongoose');
const mongooseAutoIncrement = require('mongoose-auto-increment');
const orderSchema = require('./schemas/order');
const productSchema = require('./schemas/product');
const stastisticsSchema = require('./schemas/statistics');

const ERRORS = require('../constants/errors');

/**
 * Creates the DB abstraction layer for communicating with MongoDB.
 *
 * @class DB
 * @param {Object} config Configuration object with structure:
 *
 *  {
 *    host: <String> The target MongoDB host to use.
 *    port: <Number> The target MongoDB port to use.
 *    database: <String> The target MongoDB database name to use.
 *    replicaSet: <String> The target MongoDB replica set name to use.
 *  }
 *
 * * @param {Object} logger An instance of the Logger module.
 *
 * @constructor
 */
class DB {
  constructor (config, logger) {
    this._config = config;
    this._logger = logger;
    this._connection = null;
    this.models = {};
  }

  /**
   * Initiates the connection with the target MongoDB.
   *
   * @method connect
   * @returns {Boolean} True.
   */
  async connect () {
    let uri = `mongodb://${this._config.uri}/${this._config.database}`;

    if (this._config.replicaSet !== '') {
      uri = uri + `?replicaSet=${this._config.replicaSet}`;
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
      this._logger.error('Initial DB connection error: ', {
        errorCode: ERRORS.DB.INTERNAL_ERROR,
        error: error
      });
    }

    this._logger.info('MongoDB database connection created successfully');
    this._connection = mongoose.connection;

    this._connection
      .on('all', () => this._logger.info(`Connected to all nodes of the replica set ${uri}`))
      .on('error', (error) =>
        this._logger.error('General DB connection error: ', {
          errorCode: ERRORS.DB.INTERNAL_ERROR,
          error: error
        }))
      .on('disconnected', () => this._logger.error('DB disconnected.', {
        errorCode: ERRORS.DB.CONNECTION_ERROR
      }));

    this.mountModels();

    return true;
  }

  /**
   * Mounts the available Mongoose ODM models and wraps them in a custom object for easier access.
   *
   * @returns {Boolean} True once all the models have been mounted.
   */
  mountModels () {
    mongooseAutoIncrement.initialize(this._connection);

    orderSchema.plugin(mongooseAutoIncrement.plugin, { model: 'Order', startAt: 1 });
    productSchema.plugin(mongooseAutoIncrement.plugin, { model: 'Product', startAt: 1 });

    this.models.Order = this._connection.model('Order', orderSchema);
    this.models.Product = this._connection.model('Product', productSchema);
    this.models.Statistics = this._connection.model('Statistics', stastisticsSchema);

    return true;
  }
}

module.exports = DB;
