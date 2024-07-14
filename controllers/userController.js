const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, password, email, role } = req.body;
    try {
        const user = new User({ username, password, email, role });
        await user.save();
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', {
            expiresIn: '1h',
        });
        // res.status(201).json({ token: token, role: user.role });
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: true,
            maxAge: 3600000, //1 hour
        });
        res.cookie('role', user.role, {
            sameSite: true,
            maxAge: 3600000, //1 hour
        });

        res.status(201).json({ message: 'User created succesfully' });
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
        // res.json({ token: token, role: user.role });
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
