const request = require('axios');
const MongoClient = require('mongodb').MongoClient;
const fixtures = require('./fixtures');

const SERVER_URL = 'http://127.0.0.1';
const BASE_PATH = 'api/products';
const MONGO_URL = 'mongodb://127.0.0.1:27018,127.0.0.1:27019,127.0.0.1:27020/?replicaSet=mongo-replicaset-0';
const MONGO_DATABASE = 'sample-order-system';

describe('/api/products', () => {
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

  describe('GET /', () => {
    beforeEach(async () => {
      await db.collection('products').deleteMany({});
    });

    it('Returns status code 200 and an empty array if there are no products.', async () => {
        const response = await request.get(`${SERVER_URL}/${BASE_PATH}`);

        expect(response.status).toBe(200);
        expect(response.data).toEqual([]);
    });
    it('Returns status code 200 and an array with all the products in the DB.', async () => {
      const sampleProducts = fixtures.products;
      await db.collection('products').insertMany(sampleProducts);

      const response = await request.get(`${SERVER_URL}/${BASE_PATH}`);

      expect(response.status).toBe(200);
      expect(response.data.length).toBe(3);
      expect(response.data).toEqual(sampleProducts);
    });
  });

  describe('POST /', () => {
    const validBody = {
      name: 'test product 1',
      price: 123
    };

    let currentBody;

    beforeEach(async () => {
      currentBody = {...validBody};

      await db.collection('products').deleteMany({});
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

      describe('Parameter `name`', () => {
        it('Returns status code 400 if parameter `name` is not defined in JSON body .', async () => {
          delete currentBody.name;

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `name` is malformed in JSON body - number.', async () => {
          currentBody.name = 12345;

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `name` is malformed in JSON body - object.', async () => {
          currentBody.name = {};

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `name` is malformed in JSON body - array.', async () => {
          currentBody.name = [];

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
      })

      describe('Parameter `price`', () => {
        it('Returns status code 400 if parameter `price` is not defined in JSON body .', async () => {
          delete currentBody.price;

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `price` is malformed in JSON body - string.', async () => {
          currentBody.price = 'foo';

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `price` is malformed in JSON body - object.', async () => {
          currentBody.price = {};

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
        it('Returns status code 400 if parameter `price` is malformed in JSON body - array.', async () => {
          currentBody.price = [];

          try {
            await request.post(`${SERVER_URL}/${BASE_PATH}`, currentBody);
          } catch (error) {
            expect(error.response.status).toBe(400);
          }
        });
      });
    });
    describe('Success', () => {
      it('Returns status code 201 and the created item in the response if it succeeds.', async () => {
        const response = await request.post(`${SERVER_URL}/${BASE_PATH}`, validBody);

        const latestItemAfterInsert = await db.collection('products').findOne({});

        const expected = {
          id: latestItemAfterInsert._id,
          ...validBody
        }

        expect(response.status).toBe(201);
        expect(response.data).toEqual(expected);
      });
    });
  });
});
