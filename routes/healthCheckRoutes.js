const express = require('express');
const { healthCheck } = require('../controllers/healthCheckController');

const router = express.Router();

router.get('/', healthCheck);

module.exports = router;
