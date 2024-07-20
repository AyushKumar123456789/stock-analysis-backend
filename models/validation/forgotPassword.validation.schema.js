const yup = require('yup');

module.exports = yup.object().shape({
    email: yup.string().email().required(),
});
