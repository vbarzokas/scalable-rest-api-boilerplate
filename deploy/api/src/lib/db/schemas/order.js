const mongoose = require('mongoose');

/**
 * @swagger
 * definitions:
 *   Order:
 *     type: object
 *     required:
 *       - items
 *     properties:
 *       items:
 *         description: The items of the order
 *         type: array
 *         items:
 *            $ref: '#/definitions/OrderItem'
 *   OrderItem:
 *     type: object
 *     properties:
 *       productId:
 *         description: Unique ID of the product
 *         type: number
 *       quantity:
 *         description: Quantity of the target product
 *         type: integer
 *         minimum: 1
 *         format: int64
 *     required:
 *       - productId
 *       - quantity
 *   OrderItemWithPrices:
 *     type: object
 *     properties:
 *       productId:
 *         description: Unique ID of the product
 *         type: number
 *         example: 123
 *       productPrice:
 *         description: The price of the product at the time that the order was placed
 *         type: number
 *         example: 50
 *       quantity:
 *         description: Quantity of the target product
 *         type: integer
 *         minimum: 1
 *         format: int64
 *         example: 3
 *   OrderWithPrices:
 *     type: object
 *     properties:
 *       items:
 *         description: The items of the order
 *         type: array
 *         items:
 *            $ref: '#/definitions/OrderItemWithPrices'
 *       date:
 *        description: Date that the order was placed
 *        type: string
 *        example: 2020-10-12T14:30:48.751Z
 *       totalPrice:
 *        description: The total amount of all items in the order
 *        type: number
 *        example: 150
 *   Orders:
 *     type: array
 *     items:
 *       $ref: '#/definitions/Order'
 */
const orderSchema = new mongoose.Schema({
  date: {
    type: Date
  },
  items: [{
    productId: {
      type: Number,
      ref: 'Product',
      required: true
    },
    productPrice: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  totalPrice: {
    type: Number
  }
},
{
  collection: 'orders'
});

module.exports = orderSchema;
