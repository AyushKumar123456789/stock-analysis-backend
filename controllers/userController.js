const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SendMail } = require('../util/nodemailer/EmailValidation');

exports.registerByMail = async (req, res) => {
    try {
        const jwt_token = req.query.token;
        if (!jwt_token) {
            return res.status(400).json({
                error: 'Token not found',
                message: 'User not created',
            });
        }

        const decoded = jwt.verify(jwt_token, 'your_jwt_secret');
        const { username, email, password, role } = decoded;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                error: 'User already exists',
                message: 'User not created',
            });
        }

        const user = new User({ username, password, email, role });
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

        res.redirect(201, 'http://127.0.0.1:3000/api/login');
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
        const { username, password, email, role } = req.body;
        if (!username || !password || !email || !role) {
            return res.status(400).json({
                error: 'Please fill all the fields',
                message: 'User not created',
            });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                error: 'User already exists',
                message: 'User not created',
            });
        }

        const jwt_Token = jwt.sign(
            { username, email, password, role },
            'your_jwt_secret',
            { expiresIn: '24h' }
        );

        const mailOptions = {
            username,
            email,
            message: jwt_Token,
        };

        await SendMail(mailOptions);

        res.status(201).json({
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
