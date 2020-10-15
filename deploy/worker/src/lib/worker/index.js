/**
 * Creates the Worker server abstraction for calculating the statistics.
 *
 * @class Worker
 * @param {Object} config Configuration object with structure:
 *
 *  {
 *    interval: <Number> The interval on which to calculate and store the statistics.
 *  }
 *
 * @param {Object} logger An instance of the Logger module.
 * @param {Object} db An instance of the DB module.
 * @constructor
 */
class Worker {
  constructor (config, logger, db) {
    this._config = config;
    this._logger = logger;
    this._db = db;

    this._interval = null;
  }

  /**
   * Starts the interval schedule of the worker.
   *
   * @method start
   */
  async start () {
    // perform actions only if the interval hasn't already started.
    if (this._interval === null) {
      this._interval = setInterval(async () => {
        const statistics = await this._db.calculateOrderStatistics();
        await this._db.insertOrderStatistics(statistics);
      }, this._config.interval);
    }
  }

  /**
   * Stops the interval schedule of the worker.
   *
   * @method stop
   */
  stop () {
    // perform actions only if the interval hasn't already stopped.
    if (this._interval !== null) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }
}

module.exports = Worker;
