const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
    const token =
        req.cookies?.token ||
        req.header('Authorization').replace('Bearer ', '');
    const type_of_request = req.method;
    // console.log(token);
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findOne({ _id: decoded.id });
        // console.log(user);
        if (type_of_request === 'POST' && user.role != 'editor')
            throw new Error('You are not authorized to perform this action');
        if (!user) throw new Error();
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = auth;
