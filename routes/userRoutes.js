const express = require('express');
const {
    register,
    login,
    logout,
    registerByMail,
    forgotPassword,
    resetPassword,
    getUserFromToken,
    signInWithEmail,
    signInWithGmail,
} = require('../controllers/userController');
const validator = require('../middleware/validator.middleware');
const registerSchema = require('../models/validation/register.validation.schema');
const loginSchema = require('../models/validation/login.validation.schema');
const resetPasswordSchema = require('../models/validation/resetPassword.validation.schema');
const forgotPasswordSchema = require('../models/validation/forgotPassword.validation.schema');

const router = express.Router();

router.get('/registerByMail', registerByMail);
router.post(
    '/forgot-password',
    validator(forgotPasswordSchema),
    forgotPassword
);
router.post('/reset-password', validator(resetPasswordSchema), resetPassword);
router.post('/register', validator(registerSchema), register);
router.post('/login', validator(loginSchema), login);
router.post('/logout', logout);
router.post('/get-user-from-token', getUserFromToken);
router.post('/email-signin', signInWithEmail);
router.post('/gmail-signin', signInWithGmail);

module.exports = router;
