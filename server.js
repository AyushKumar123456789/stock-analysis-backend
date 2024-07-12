require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
connectDB();

// app.use(cors());
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true, //cridentials means that the server will accept the cookies from the client
    })
);

app.use(
    express.json({
        limit: '50mb', //it is the maximum size of the request body that can be accepted by the server
    })
); //it sets up the middleware that tells the Express app to automatically understand and handle JSON data sent in HTTP requests.
/*
Without this middleware, if a client sends JSON data in a request, your Express app won't be able to read it directly. 
This line makes sure your app can handle and work with JSON data sent by clients.
*/

app.use(express.urlencoded({ extended: true })); //it is used to parse the incoming requests with urlencoded payloads.for example, when you submit a form, the data is sent to the server in the form of a URL-encoded string.
app.use(express.static('public')); //it is used to serve static files such as images, CSS files, and JavaScript files.
app.use(cookieParser());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/stocks', require('./routes/stockRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
