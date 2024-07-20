const express = require('express');
const { createStock, getStocks } = require('../controllers/stockController');
const auth = require('../middleware/auth.middleware');
const { USER_EDITOR_ROLE } = require('../util/constants');

const router = express.Router();

router.post('/', auth({ requiredRole: USER_EDITOR_ROLE }), createStock);
router.get('/', getStocks);

module.exports = router;
