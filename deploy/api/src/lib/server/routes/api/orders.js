const _ = require('lodash');
const statusCodes = require('http-status-codes');

const db = require('../../../db');
const ERRORS = require('../../../constants/errors');

module.exports = (router) => {
  /**
   * @swagger
   * /orders:
   *   post:
   *     description: Create a new order
   *     tags:
   *       - orders
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: order
   *         description: Order object
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Order'
   *     responses:
   *       200:
   *         description: Successfully created a new order
   *         schema:
   *           $ref: '#/definitions/Order'
   *       400:
   *         description: Missing or invalid required parameters in the JSON body
   *       422:
   *         description: One or more of the defined product IDs in the JSON body does not exist
   *       500:
   *         description: Internal server occurred while executing the request
   */
  router.post('/orders', async (req, res, next) => {
    const productIds = req.body.items.map((item) => {
      return item.productId;
    });

    const products = await db.getModel('Product')
      .find()
      .where('_id')
      .in(productIds)
      .exec();

    // ensure that all products requested refer to existing IDs, otherwise return an error
    if (products.length !== productIds.length) {
      const error = new Error();
      error.status = statusCodes.StatusCodes.UNPROCESSABLE_ENTITY;
      error.errorCode = ERRORS.API.ORDER.PRODUCT_NOT_FOUND;

      return next(error);
    }

    // merge the product properties from the incoming data with what we have stored in DB
    const mergedProducts = _.map(req.body.items, (targetProduct) => {
      const matchingProduct = _.find(products, { _id: targetProduct.productId });

      return _.extend(targetProduct, {
        productPrice: matchingProduct.price
      });
    });

    // perform a deep copy of the incoming data and add the extra properties we want to store
    const orderDetails = JSON.parse(JSON.stringify(req.body));
    orderDetails.date = new Date().toISOString();
    orderDetails.items = mergedProducts;
    orderDetails.totalPrice = mergedProducts.reduce((accumulator, product) => {
      return accumulator + (product.productPrice * product.quantity);
    }, 0);

    const OrderModel = db.getModel('Order');
    const order = new OrderModel(orderDetails);
    const savedItem = await order.save();

    return res.status(201).send({
      id: savedItem._id,
      ...orderDetails
    });
  });

  /**
   * @swagger
   * /orders/{id}:
   *   get:
   *     description: Retrieve the details of a specific order
   *     tags:
   *       - orders
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         description: id of the order to retrieve
   *         in: path
   *         required: true
   *         type: number
   *     responses:
   *       200:
   *         description: Successfully retrieved the requested order
   *         schema:
   *           $ref: '#/definitions/OrderWithPrices'
   *       404:
   *         description: The target order was not found in the system
   *       500:
   *         description: Internal server occurred while executing the request
   */
  router.get('/orders/:id', async (req, res) => {
    const order = await db.getModel('Order').findById(req.params.id);

    if (!order) {
      return res.status(404).send();
    }

    return res.send(order);
  });
};
