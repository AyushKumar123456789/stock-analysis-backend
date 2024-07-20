const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { AuthorizationError, UserNotFoundError } = require('../error');

const auth = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.header('Authorization').replace('Bearer ', '');
        const requestMethod = req.method;

        const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
        const { id: userId } = tokenPayload;

        const user = await User.findOne({ _id: userId });

        if (requestMethod === 'POST' && user.role != 'editor')
            throw new AuthorizationError();
        if (!user) throw UserNotFoundError();

        req.user = user;

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = auth;
