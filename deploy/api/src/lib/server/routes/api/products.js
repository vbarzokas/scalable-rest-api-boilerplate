module.exports = (router, db) => {
  /**
   * @swagger
   * /products:
   *   post:
   *     description: Create a new product
   *     tags:
   *       - products
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: product
   *         description: Product object
   *         in: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Product'
   *     responses:
   *       201:
   *         description: Successfully created a new product
   *         schema:
   *           $ref: '#/definitions/Product'
   *       400:
   *         description: Missing required parameters in the JSON body
   *       500:
   *         description: Internal server occurred while executing the request
   */
  router.post('/products', async (req, res) => {
    const product = new db.models.Product(req.body);
    const savedItem = await product.save();

    return res.status(201).send({
      id: savedItem._id,
      ...req.body
    });
  });

  /**
   * @swagger
   * /products:
   *   get:
   *     description: Retrieve the list of products
   *     tags:
   *       - products
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: products
   *         schema:
   *           $ref: '#/definitions/Products'
   *       500:
   *         description: Internal server occurred while executing the request
   */
  router.get('/products', async (req, res) => {
    const products = await db.models.Product.find({});

    return res.send(products);
  });
};
