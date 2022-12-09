const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
const cookieParser = require('cookie-parser');
const authorizeRouter = require('./routes/authorize');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());


app.use('/', authorizeRouter);
// get driver connection
const dbo = require('./db/conn');

app.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });
    console.log(`Server is running on port: ${port}`);
});