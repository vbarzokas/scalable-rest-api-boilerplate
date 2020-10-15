const request = require('axios');
const MongoClient = require('mongodb').MongoClient;
const fixtures = require('./fixtures');

const SERVER_URL = 'http://127.0.0.1';
const BASE_PATH = 'api/orders';
const MONGO_URL = 'mongodb://127.0.0.1:27018,127.0.0.1:27019,127.0.0.1:27020/?replicaSet=mongo-replicaset-0';
const MONGO_DATABASE = 'sample-order-system';

describe('/api/orders', () => {
  let connection = null;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await connection.db(MONGO_DATABASE);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  })

  describe('GET /:id', () => {
    beforeEach(async () => {
      await db.collection('orders').deleteMany({});
    });

    describe('Failures', () => {
      it('Returns status code 404 if the target order was not found.', async () => {
        try {
          await request.get(`${SERVER_URL}/${BASE_PATH}/123456789`);
        } catch (error) {
          expect(error.response.status).toBe(404);
        }
      });
    })
    describe('Success', () => {
      it('Returns status code 200 and the contents of the target order.', async () => {
        const sampleOrder = fixtures.orders[0];

        await db.collection('orders').insertOne(sampleOrder);

        const response = await request.get(`${SERVER_URL}/${BASE_PATH}/1`);

        expect(response.status).toBe(200);
        expect(response.data).toEqual(sampleOrder);
      });
    });
  });
  describe('POST /', () => {
    const validBody = {
      items: [{
        productId: 12345,
        quantity: 10
      }]
    };

    let currentBody;

    beforeEach(async () => {
      currentBody = JSON.parse(JSON.stringify(validBody));

      await db.collection('orders').deleteMany({});
    });

    describe('Failures:', () => {
      it('Returns status code 400 if no JSON body is defined in the request.', async () => {
        try {
          await request.post(`${SERVER_URL}/${BASE_PATH}`);
        } catch (error) {
          expect(error.response.status).toBe(400);
        }
      });
      it('Returns status code 400 if an empty JSON body is defined in the request.', async () => {
        currentBody = {};

        try {
          await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
        } catch (error) {
          expect(error.response.status).toBe(400);
        }
      });

      describe('Parameter `items`', () => {
        it('Returns status code 400 if parameter `items` is not defined in JSON body .', async () => {
          delete currentBody.items;

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - number.', async () => {
          currentBody.items = 12345;

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - object.', async () => {
          currentBody.items = {};

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - empty array.', async () => {
          currentBody.items = [];

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - empty item.', async () => {
          currentBody.items = [{}];

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - item with missing `productId`.', async () => {
          delete currentBody.items[0].productId;

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - item with wrong `productId` - string.', async () => {
          currentBody.items[0].productId = 'foo';

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - item with wrong `productId` - object.', async () => {
          currentBody.items[0].productId = {};

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - item with wrong `productId` - array.', async () => {
          currentBody.items[0].productId = [];

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - item with missing `quantity`.', async () => {
          delete currentBody.items[0].quantity;

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - item with wrong `quantity` - string.', async () => {
          currentBody.items[0].quantity = 'foo';

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - item with wrong `quantity` - object.', async () => {
          currentBody.items[0].quantity = {};

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - item with wrong `quantity` - array.', async () => {
          currentBody.items[0].quantity = [];

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `items` is malformed in JSON body - item with wrong `quantity` - 0.', async () => {
          currentBody.items[0].quantity = 0;

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
      });

      it('Returns status code 422 if the `productId` defined in JSON body does not exist.', async () => {
        currentBody.items[0].productId = 1234567890;

        try {
          await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
        } catch (error) {
          expect(error.response.status).toBe(422);
        }
      });
    });
    describe('Success', () => {
      it('Returns status code 201 and the created item in the response if it succeeds.', async () => {
        await db.collection('products').insertOne({
          _id: validBody.items[0].productId,
          name: 'sample-product-123',
          price: 100
        });

        const response = await request.post(`${SERVER_URL}/${BASE_PATH}`, validBody);

        const latestItemAfterInsert = await db.collection('orders').findOne({});

        validBody.items[0].productPrice = 100;
        const expected = {
          id: latestItemAfterInsert._id,
          items: validBody.items,
          totalPrice: validBody.items[0].productPrice * validBody.items[0].quantity,
        }

        expect(response.status).toBe(201);
        expect(typeof response.data.date).toBe('string');

        // date cannot be determined exactly so we remove it from the object comparison
        delete response.data.date;
        expect(response.data).toEqual(expected);
      });
    });
  });
});
