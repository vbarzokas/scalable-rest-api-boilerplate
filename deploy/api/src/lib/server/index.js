const bodyParser = require('body-parser');
const bunyanMiddleware = require('bunyan-middleware');
const express = require('express');
const nocache = require('nocache');
const statusCodes = require('http-status-codes');
const swaggerExpressMiddleware = require('@apidevtools/swagger-express-middleware');

const logger = require('../logger');
const routes = require('./routes');
const swagger = require('./swagger');

function mountMiddlewares(serverInstance, config) {
  serverInstance.use(bunyanMiddleware({ logger: logger.getInstance() }));
  serverInstance.use(bodyParser.json());

  swagger.init(config.swagger);
  serverInstance.use('/api/docs', swagger.getRouter());

  const swaggerMiddleware = swaggerExpressMiddleware(swagger.getSpec(), serverInstance);
  serverInstance.use(
    swaggerMiddleware.metadata(),
    swaggerMiddleware.CORS(),
    swaggerMiddleware.parseRequest(),
    swaggerMiddleware.validateRequest()
  );

  serverInstance.use(nocache());

  serverInstance.use((err, req, res, next) => {
    delete err.stack;

    res.status(err.status || statusCodes.StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  });
}

function mountRoutes(serverInstance) {
  const router = express.Router();

  routes.mount(router);
  serverInstance.use('/api', router);
}

/**
 * Creates the HTTP server abstraction for communicating with the REST API and
 * listens for incoming requests.
 *
 * @function create
 * @param {Object} config Configuration object with structure:
 *
 *  {
 *    host: <String> The target HTTP host to use.
 *    port: <Number> The target HTTP port to use.
 *    swagger: <Object> The configuration for the Swagger spec definition.
 *  }
 * @returns {Object}
 */
async function start(config) {
  const log = logger.getInstance();
  const instance = express();

  mountMiddlewares(instance, config);
  mountRoutes(instance);

  await instance.listen(config.port);

  log.info(`Server running and listening at port ${config.port}`);

  return instance;
}

module.exports = {
  start
};
