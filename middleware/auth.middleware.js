const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const { USER_ROLES } = require('../util/constants');
const {
    AuthenticationRequiredError,
    InvalidCredentialsError,
    AuthorizationError,
} = require('../error');

module.exports =
    (
        options = {
            requiredRole: null,
        }
    ) =>
    async (req, res, next) => {
        try {
            const tokenFromCookie = req.cookies?.token;

            const authHeader = req.header('Authorization');
            if (!authHeader && !tokenFromCookie)
                throw new AuthenticationRequiredError();

            const tokenFromHeader = authHeader?.replace('Bearer ', '');
            const token = tokenFromCookie || tokenFromHeader;

            const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
            const { id: userId } = tokenPayload;

            const user = await User.findOne({ _id: userId });
            if (!user) throw new InvalidCredentialsError();

            if (
                options.requiredRole &&
                USER_ROLES.includes(options.requiredRole)
            ) {
                if (user.role !== options.requiredRole) {
                    throw new AuthorizationError();
                }
            }

            req.user = user;

            next();
        } catch (err) {
            next(err);
        }
    };
