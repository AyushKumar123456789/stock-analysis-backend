const express = require('express');
const { createStock, getStocks } = require('../controllers/stockController');
const auth = require('../middleware/auth');
const router = express.Router();
const { isLoggedIn } = require('../middleware/auth');

router.post('/', auth, createStock);
router.get('/', getStocks);

module.exports = router;
