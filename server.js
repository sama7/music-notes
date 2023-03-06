const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const authorizeRouter = require('./routes/authorize');
const noteRouter = require('./routes/note');
const compression = require('compression');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    exposedHeaders: 'Retry-After',
}));
app.use(cookieParser());
app.use(helmet());

app.use(compression());
app.use('/', authorizeRouter);
app.use('/note', noteRouter);
// get driver connection
const dbo = require('./db/conn');

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
    // perform a database connection when server starts
    dbo.connectToServer(function (err) {
        if (err) console.error(err);
    });
    console.log(`Server is running on port: ${port}`);
});