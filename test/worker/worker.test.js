const MongoClient = require('mongodb').MongoClient;
const luxon = require('luxon');
const sleep = require('await-sleep');

const MONGO_URL = 'mongodb://127.0.0.1:27018,127.0.0.1:27019,127.0.0.1:27020/?replicaSet=mongo-replicaset-0';
const MONGO_DATABASE = 'sample-order-system';

describe('Worker', () => {
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
  });

  it('Fetches the statistics based on the defined interval.', async () => {
    await db.collection('products').deleteMany({});
    await db.collection('orders').deleteMany({});
    await db.collection('statistics').deleteMany({});

    await db.collection('products').insertMany([
      {
        _id: 1,
        name: 'product-1',
        price: 10
      },
      {
        _id: 2,
        name: 'product-2',
        price: 20
      },
      {
        _id: 3,
        name: 'product-3',
        price: 30
      }
    ]);
    await db.collection('orders').insertMany([
      {
        date: luxon.DateTime.fromObject({day: 1, hour: 12}).toBSON(),
        items: [{
          productId: 1,
          productPrice: 10,
          quantity: 5
        }],
        totalPrice: 50
      },
      {
        date: luxon.DateTime.fromObject({day: 2, hour: 12}).toBSON(),
        items: [{
          productId: 1,
          productPrice: 10,
          quantity: 5
        }],
        totalPrice: 50
      },
      {
        date: luxon.DateTime.fromObject({day: 2, hour: 13}).toBSON(),
        items: [{
          productId: 2,
          productPrice: 20,
          quantity: 5
        }],
        totalPrice: 100
      }
    ]);

    // ensure that the worker runs at least once
    await sleep(3000);

    const statistics = await db.collection('statistics').find({}).sort({date: 1}).toArray();

    expect(statistics.length).toBe(2);

    expect(statistics[0].ordersCount).toBe(1);
    expect(statistics[0].ordersTotalPrice).toBe(50);
    expect(statistics[1].ordersCount).toBe(2);
    expect(statistics[1].ordersTotalPrice).toBe(150);
  });
});
