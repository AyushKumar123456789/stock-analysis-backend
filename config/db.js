const { DB_NAME } = require('../util/constants');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        console.log(
            `MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`
        );
    } catch (err) {
        console.error('Error connecting to MongoDB', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
