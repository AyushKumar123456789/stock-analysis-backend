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
router.post('/logout', logout);

module.exports = router;
