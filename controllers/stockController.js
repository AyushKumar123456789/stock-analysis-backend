const Stock = require('../models/stock.model');

exports.createStock = async (req, res) => {
    const { title, content, category } = req.body;
    try {
        const stock = new Stock({ title, content, category });
        await stock.save();
        res.status(201).json(stock);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getStocks = async (req, res) => {
    try {
        const stocks = await Stock.find();
        res.json(stocks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
