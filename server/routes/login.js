const express = require('express');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');
const mariadb = require('mariadb');
const router = express.Router();

dotenv.config({path: path.resolve(__dirname, '../.env')});

const { isLoggedIn, isJoined } = require('./middlewares');
const { authenticated } = require('./auth');

const Mariadb = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// login
router.post('/user/login', authenticated, (req, res, next) => {
    console.log(req);
    Mariadb.getConnection()
        .then(conn => {
            console.log(typeof(req.body.user_code));
            conn.query(`select id from user where ${req.body.login_method}_token = '${req.body.user_code}';`)
                .then(data => {
                    res.status(200).send(data);
                })
                .catch(err => res.status(500).send('query error : ' + err));
        })
        .catch(err => res.status(500).send('db connection error : ' + err));
});

module.exports = router;