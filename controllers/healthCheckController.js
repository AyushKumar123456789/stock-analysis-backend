exports.healthCheck = (req, res) => {
    res.status(200).send('Server is running');
};
