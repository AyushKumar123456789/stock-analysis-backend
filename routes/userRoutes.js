const express = require('express');
const {
    register,
    login,
    logout,
    registerByMail,
} = require('../controllers/userController');
const router = express.Router();
const validator = require('../middleware/validator.middleware');
const registerSchema = require('../models/validation/register.validation.schema');
const loginSchema = require('../models/validation/login.validation.schema');

router.get('/registerByMail', registerByMail);
router.post('/register', validator(registerSchema), register);
router.post('/login', validator(loginSchema), login);

router.post('/logout', logout);

module.exports = router;
