module.exports = {
  http: {
    host: process.env.HTTP_HOST || '127.0.0.1',
    port: process.env.HTTP_PORT || 3000,
    swagger: {
      swaggerDefinition: {
        info: {
          title: 'REST - Sample Order System',
          version: '1.0.0',
          description: 'Products and Orders REST API',
          contact: {
            email: 'contact@vbarzokas.com'
          }
        },
        tags: [
          {
            name: 'products',
            description: 'Products API'
          },
          {
            name: 'orders',
            description: 'Orders API'
          }
        ],
        schemes: ['http'],
        basePath: '/api'
      },
      apis: [
        './lib/server/routes/api/products.js',
        './lib/server/routes/api/orders.js',
        './lib/db/schemas/product.js',
        './lib/db/schemas/order.js'
      ]
    }
  },
  mongo: {
    uri: process.env.MONGO_URI || '127.0.0.1:27017',
    database: process.env.MONGO_DATABASE || 'sample-order-system',
    replicaSet: process.env.MONGO_REPLICA_SET || ''
  }
};
