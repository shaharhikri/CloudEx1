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

// x = new Date('')
// y = new Date("1963-11-19")
// console.log(x)
// console.log(y)
// console.log(isNaN(x))
// console.log(isNaN(y))
// let a = []
// console.log(Array.isArray(a) )

// const { User } = require('./src/dbUtils/modelClasses');
// let u = new User("customer1@afeka.ac.il", {first:"Cynthia", last:"Chambers"}, "ab4de", "19-11-1963", ["goldCustomer","platinumClub","primeService"] )
// console.log(u)

// console.log(y.toLocaleDateString("he-IL"))