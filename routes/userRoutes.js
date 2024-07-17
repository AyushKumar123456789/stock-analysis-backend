const express = require('express');
const {
    register,
    login,
    logout,
    registerByMail,
} = require('../controllers/userController');
const router = express.Router();


router.post('/register', register);
router.get('/registerByMail', registerByMail);
router.post('/login', login);
// const validator = require('../middleware/validator');
// const registerSchema = require('../validation/register.schema');
// const loginSchema = require('../validation/login.schema');

// router.post('/register', validator(registerSchema), register);
// router.post('/login', validator(loginSchema), login);

router.post('/logout', logout);

module.exports = router;
