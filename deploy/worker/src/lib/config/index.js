module.exports = {
  mongo: {
    uri: process.env.MONGO_URI || '127.0.0.1:27017',
    database: process.env.MONGO_DATABASE || 'sample-order-system',
    replicaSet: process.env.MONGO_REPLICA_SET || ''
  },
  worker: {
    interval: process.env.WORKER_INTERVAL || 300000
  }
};
