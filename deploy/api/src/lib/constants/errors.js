'use strict';

/**
 * The collection of error IDs supported by this API.
 *
 * @class Errors
 * @static
 */
module.exports = {
  DB: {
    /**
     * There was a connection error with the DB module.
     *
     * @property {Number} DB.CONNECTION_ERROR
     * @default 10001
     * @static
     * @final
     */
    CONNECTION_ERROR: 10001,
    /**
     * There was an internal error on the DB module during an operation.
     *
     * @property {Number} DB.INTERNAL_ERROR
     * @default 10002
     * @static
     * @final
     */
    INTERNAL_ERROR: 10002
  },
  API: {
    ORDER: {
      /**
       * The target product was not found in the DB.
       *
       * @property {Number} API.ORDER.PRODUCT_NOT_FOUND
       * @default 20001
       * @static
       * @final
       */
      PRODUCT_NOT_FOUND: 20001
    }
  }
};
