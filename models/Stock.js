const mongoose = require("mongoose");

const StockSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const Stock = mongoose.model("Stock", StockSchema);
module.exports = Stock;
