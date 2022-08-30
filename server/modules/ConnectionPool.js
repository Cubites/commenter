const mariadb = require('mariadb');
const dotenv = require('dotenv');
dotenv.config();

const ConnectionPool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    bigIntAsNumber: true,
    timezone: 'Asia/Seoul',
    connectionLimit: 10
});

module.exports = ConnectionPool;