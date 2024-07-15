const mongoose = require('mongoose');
const {Schema} = mongoose;

const stockSchema = new Schema({
  name: String,
  symbol: String,
  rank: Number,
  age: Number,
  color: String,
  png32: String,
  png64: String,
  webp32: String,
  webp64: String,
  exchanges: Number,
  markets: Number,
  pairs: Number,
  categories: [String],
  allTimeHighUSD: Number,
  circulatingSupply: Number,
  totalSupply: Number,
  maxSupply: Number,
  code: String,
  rate: Number,
  volume: Number,
  cap: Number,
  createDate: {
    type: Date,
    default: Date.now
  }
});


const Stock = mongoose.model('stocks',stockSchema);

module.exports = Stock;
