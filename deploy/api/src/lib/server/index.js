const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');
const express = require('express');
const nocache = require('nocache');
const routes = require('./routes');
const statusCodes = require('http-status-codes');
const Swagger = require('./swagger');
const swaggerExpressMiddleware = require('@apidevtools/swagger-express-middleware');

/**
 * Creates the HTTP server abstraction for communicating with the REST API.
 *
 * @class Server
 * @param {Object} config Configuration object with structure:
 *
 *  {
 *    host: <String> The target HTTP host to use.
 *    port: <Number> The target HTTP port to use.
 *    swagger: <Object> The configuration for the Swagger spec definition.
 *  }
 *
 * @param {Object} logger An instance of the Logger module.
 * @param {Object} db An instance of the DB module.
 * @constructor
 */
class Server {
  constructor (config, logger, db) {
    this._config = config;
    this._logger = logger;
    this._db = db;
    this._instance = express();
    this._router = express.Router();
  }

  /**
   * Starts the HTTP server and listens for incoming requests.
   *
   * @method start
   * @returns {Promise}
   */
  async start () {
    this._instance.use(bunyanMiddleware({ logger: this._logger }));
    this._instance.use(bodyParser.json());

    const swagger = new Swagger(this._config.swagger);
    this._instance.use('/api/docs', swagger.router);

    const swaggerMiddleware = swaggerExpressMiddleware(swagger.spec, this._instance);
    this._instance.use(
      swaggerMiddleware.metadata(),
      swaggerMiddleware.CORS(),
      swaggerMiddleware.parseRequest(),
      swaggerMiddleware.validateRequest()
    );

    routes.mount(this._router, this._db);
    this._instance.use('/api', this._router);

    this._instance.use(nocache());

    this._instance.use((err, req, res, next) => {
      delete err.stack;

      res.status(err.status || statusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json(err);
    });

    return this._instance.listen(this._config.port, () => this._logger.info('Server is running!'));
  }
}

module.exports = Server;
