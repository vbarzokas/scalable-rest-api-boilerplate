const MongoClient = require('mongodb').MongoClient;

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
    this.instance = null;
  }

  /**
   * Initiates the connection with the target MongoDB.
   *
   * @method connect
   * @returns {Boolean} True.
   */
  async connect () {
    let uri = `mongodb://${this._config.uri}/`;

    if (this._config.replicaSet !== '') {
      uri = uri + `?replicaSet=${this._config.replicaSet}`;
    }

    try {
      this._connection = await MongoClient.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      this.instance = await this._connection.db(this._config.database);
    } catch (error) {
      this._logger.error('Initial DB connection error: ', {
        errorCode: ERRORS.DB.INTERNAL_ERROR,
        error: error
      });
    }

    this._logger.info('MongoDB database connection created successfully');

    return this.instance;
  }

  /**
   * Calculates the following statistics: total number of orders and their price, grouped per date.
   *
   * @method calculateOrderStatistics
   * @returns {Array}
   */
  async calculateOrderStatistics () {
    const query = [
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$date' },
            month: { $month: '$date' },
            year: { $year: '$date' }
          },
          ordersCount: { $sum: 1 },
          ordersTotalPrice: { $sum: '$totalPrice' }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $substr: ['$_id.day', 0, 2] }, '-',
              { $substr: ['$_id.month', 0, 2] }, '-',
              { $substr: ['$_id.year', 0, 4] }
            ]
          },
          ordersCount: 1,
          ordersTotalPrice: 1
        }

      }
    ];

    const orderStatistics = await this.instance.collection('orders').aggregate(query).toArray();

    this._logger.info('Calculated statistics.');

    return orderStatistics;
  }

  /**
   * Inserts the statistics into the database.
   *
   * @param {Array} orderStatistics The array of the statistics objects.
   * @returns {Promise<void>}
   */
  async insertOrderStatistics (orderStatistics) {
    if (orderStatistics !== null && orderStatistics.length > 0) {
      // remove the existing statistics to avoid collisions on every start of the server
      // and also cover the possibility where the orders have changed
      await this.instance.collection('statistics').deleteMany({});
      await this.instance.collection('statistics').insertMany(orderStatistics);

      this._logger.info('Inserted statistics.');
    }
  }
}

module.exports = DB;
