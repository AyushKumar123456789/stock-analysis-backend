const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AuthorizationError, AuthenticationRequiredError } = require('../error');

const auth = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.header('Authorization').replace('Bearer ', '');
        const type_of_request = req.method;

        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findOne({ _id: decoded.id });

        if (type_of_request === 'POST' && user.role != 'editor')
            throw new AuthorizationError();
        if (!user) throw new AuthenticationRequiredError();
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = auth;
