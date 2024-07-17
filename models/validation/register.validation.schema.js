const yup = require('yup');

module.exports = yup.object().shape({
    email: yup.string().email().required(),
    username: yup.string().required(),
    password: yup.string().required(),
    role: yup.string().oneOf(['user', 'editor']).default('user').optional(),
});
