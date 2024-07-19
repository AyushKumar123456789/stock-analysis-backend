const { ValidationError } = require('yup');
const { JsonWebTokenError } = require('jsonwebtoken');
const { mapInnerErrors } = require('../util/validator');
const { AppError } = require('../error');

module.exports = (err, req, res, next) => {
    let statusCode;
    let json;

    switch (true) {
        case err instanceof AppError:
            statusCode = err.statusCode;
            json = {
                error: {
                    name: err.name,
                    message: err.message,
                },
            };
            break;
        case err instanceof ValidationError:
            statusCode = 400;
            json = {
                error: {
                    name: 'VALIDATION_ERROR',
                    message: 'Your requested data is not valid.',
                    details: mapInnerErrors(err),
                },
            };
            break;
        case err instanceof JsonWebTokenError:
            statusCode = 400;
            json = {
                error: {
                    name: 'INVALID_TOKEN',
                    message: 'Your token is not valid.',
                },
            };
            break;
        default:
            statusCode = 500;
            json = {
                error: {
                    name: 'INTERNAL_SERVER_ERROR',
                    message: 'Internal Server Error',
                },
            };
    }

    res.status(statusCode).json(json);
};
