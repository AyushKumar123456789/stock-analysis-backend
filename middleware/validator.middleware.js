const { ValidationError } = require('yup');
const { mapInnerErrors } = require('../util/validator');

module.exports = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body, { abortEarly: false });
        next();
    } catch (err) {
        if (err instanceof ValidationError) {
            res.status(400).json({
                code: err.name,
                errors: mapInnerErrors(err),
            });
        }

        next(err);
    }
};
