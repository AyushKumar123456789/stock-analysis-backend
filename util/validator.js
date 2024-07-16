const mapInnerErrors = (err) => {
    const errors = [];
    err.inner.forEach((innerError) => {
        errors.push({
            path: innerError.path,
            message: innerError.message,
        });
    });
    return errors;
};

module.exports = { mapInnerErrors };
