const mongoose = require('mongoose');

/**
 * @swagger
 * definitions:
 *   Product:
 *     type: object
 *     required:
 *       - name
 *       - price
 *     properties:
 *       name:
 *         type: string
 *         example: 'Computer screen A1234'
 *       price:
 *         type: number
 *         example: 150
 *   Products:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Product'
 */
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
},
{
  collection: 'products'
});

module.exports = productSchema;
