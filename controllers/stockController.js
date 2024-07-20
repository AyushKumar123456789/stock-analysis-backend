const Stock = require('../models/stock.model');

exports.createStock = async (req, res, next) => {
    try {
        const { title, content, category } = req.body;

        const stock = new Stock({ title, content, category });
        await stock.save();

        res.status(201).json(stock);
    } catch (err) {
        next(err);
    }
};

exports.getStocks = async (req, res, next) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (err) {
        next(err);
    }
};
