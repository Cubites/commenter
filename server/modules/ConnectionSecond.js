const mariadb = require('mariadb/callback');

const ConnectionSecond = mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    bigIntAsNumber: true,
    connectionLimit: 5
});

module.exports = ConnectionSecond;