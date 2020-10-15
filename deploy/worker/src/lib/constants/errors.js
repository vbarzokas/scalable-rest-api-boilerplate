'use strict';

/**
 * The collection of error IDs supported by the Worker module.
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
     * @default 20001
     * @static
     * @final
     */
    CONNECTION_ERROR: 20001,
    /**
     * There was an internal error on the DB module during an operation.
     *
     * @property {Number} DB.INTERNAL_ERROR
     * @default 20002
     * @static
     * @final
     */
    INTERNAL_ERROR: 20002
  },
  WORKER: {
  }
};
