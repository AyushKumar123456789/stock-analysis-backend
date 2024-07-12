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
        res.status(201).json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
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
        res.json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
