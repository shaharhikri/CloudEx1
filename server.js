const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;

const express = require('express'); // Express Web Server

const app = express(); // Initialize the express web server
const customers = require('./src/routes/customers');
app.use('/customers', customers);

const server = app.listen(port, function () {
    console.log(`Listening on port ${server.address().port}`);
});