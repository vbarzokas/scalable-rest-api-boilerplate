const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

/**
 * Creates the Swagger abstraction layer.
 *
 * @class Swagger
 * @param {Object} config Configuration object for the module `swagger-jsdoc`.
 * @constructor
 */
class Swagger {
  constructor (config) {
    this.spec = swaggerJSDoc(config);
    this.router = express.Router();

    this.router.use('/', swaggerUi.serve, swaggerUi.setup(this.spec));
    this.router.get('/json', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(this.spec);
    });
  }
}
module.exports = Swagger;
