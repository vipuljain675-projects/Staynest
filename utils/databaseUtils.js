const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'airbnb',
    password: 'completecoding123', // <--- Put your actual password here
});

module.exports = pool.promise();