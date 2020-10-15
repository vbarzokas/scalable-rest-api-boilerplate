const orders = require('./api/orders');
const products = require('./api/products');

module.exports = {
  mount: (router, db) => {
    orders(router, db);
    products(router, db);
  }
};
