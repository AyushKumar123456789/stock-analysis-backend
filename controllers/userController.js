const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SendMail } = require('../util/nodemailer/EmailValidation');
const { SendForgotPasswordMail } = require('../util/nodemailer/forgotPassword');

const emailVerificationRedirect =
    process.env.FRONTEND_EMAIL_REDIRECT || 'http://localhost:5173/login';

exports.registerByMail = async (req, res) => {
    try {
        const jwt_token = req.query.token;
        if (!jwt_token) {
            return res.status(400).json({
                error: 'Token not found',
                message: 'User not created',
            });
        }

        const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);
        const { username, email, password } = decoded;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                error: 'User already exists',
                message: 'User not created, because user already exists',
            });
        }

        const user = new User({ username, password, email });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 3600000, // 1 hour
        });
        res.cookie('role', user.role, {
            sameSite: 'Strict',
            maxAge: 3600000, // 1 hour
        });

        res.redirect(emailVerificationRedirect);
    } catch (err) {
        res.status(400).json({
            error: err.message,
            message: 'User not created',
        });
    }
};

// Register user by sending a verification email
exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({
                error: 'Please fill all the fields',
                message: 'User not created',
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                error: 'User already exists',
                message: 'Alredy Registered email',
            });
        }

        const jwt_Token = jwt.sign(
            { username, email, password },
            'your_jwt_secret',
            { expiresIn: '24h' }
        );

        const mailOptions = {
            username,
            email,
            message: jwt_Token,
        };

        await SendMail(mailOptions);

        res.status(200).json({
            message: 'Verification email sent successfully',
        });
    } catch (err) {
        res.status(400).json({
            error: err.message,
            message: 'User not created',
        });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
            expiresIn: '1h',
        });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 3600000, //1 hour
        });
        res.cookie('role', user.role, {
            sameSite: true,
            maxAge: 3600000, //1 hour
        });
        res.json({ message: 'User logged in successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.clearCookie('role');
        res.json({ message: 'Logged out' });
    } catch (err) {
        res.status(400).json({ error: err.message, message: 'Not logged out' });
    }
};

exports.isLoggedIn = (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json(false);
        }
        jwt.verify(token, 'your_jwt_secret');
        res.json(true);
    } catch (err) {
        res.json(false);
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const jwt_Token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
            expiresIn: '24h',
        });
        const mailOptions = {
            username: user.username,
            email,
            message: jwt_Token,
        };
        await SendForgotPasswordMail(mailOptions);
        res.json({
            message: 'Password reset email sent successfully',
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const jwt_Token = req.query.token;
        if (!jwt_Token) {
            throw new Error('Token not found');
        }
        const decoded = jwt.verify(jwt_Token, 'your_jwt_secret');
        const { id } = decoded;
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        const { password } = req.body;
        if (!password) {
            throw new Error('Please enter a new password');
        }
        user.password = password;
        await user.save();
        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
