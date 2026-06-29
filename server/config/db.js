const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool to handle multiple requests efficiently
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Promise wrapper to allow async/await queries
const promisePool = pool.promise();

module.exports = promisePool;