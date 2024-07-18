const { ValidationError } = require('yup');
const { mapInnerErrors } = require('../util/validator');
const { AppError } = require('../error');

module.exports = (err, req, res, next) => {
    let statusCode = 500;
    let json = {
        error: {
            name: 'INTERNAL_SERVER_ERROR',
            message: 'Internal Server Error',
        },
    };

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        json = {
            error: {
                name: err.name,
                message: err.message,
            },
        };
    } else if (err instanceof ValidationError) {
        statusCode = 400;
        json = {
            error: {
                name: 'VALIDATION_ERROR',
                message: 'You requested data is not valid.',
                details: mapInnerErrors(err),
            },
        };
    }

    res.status(statusCode).json(json);
};
