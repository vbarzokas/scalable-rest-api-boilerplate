const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true
  },
  ordersCount: {
    type: Number,
    required: true
  },
  ordersTotalPrice: {
    type: Number,
    required: true
  }
},
{
  collection: 'statistics'
});

module.exports = statisticsSchema;
