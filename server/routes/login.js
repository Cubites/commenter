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
    Mariadb.getConnection()
        .then(conn => {
            conn.query(`select id from user where ${req.body.login_method}_token = '${req.body.user_code}';`)
                .then(data => {
                    if(data.length == 0){ // 신규 유저 체크
                        conn.query(`select max(id) as last_index from user;`)
                            .then(data => {
                                if(data[0].last_index == null){ // 사이트에 가입한 첫 유저인 경우
                                    conn.query(`
                                        insert into user (id, nickname, ${req.body.login_method}_token)
                                            value (1, '${(Math.round(Math.random() * 1000000))}', '${req.body.user_code}');
                                    `);
                                }else{
                                    conn.query(`
                                        insert into user (id, nickname, ${req.body.login_method}_token)
                                            value (${data[0].last_index + 1}, '${(Math.round(Math.random() * 1000000))}', '${req.body.user_code}');
                                    `);
                                }
                            })
                            .catch(err => res.status(500).send('id check err : ' + err));
                        // next()
                    }
                    res.status(200).send(data);
                })
                .catch(err => res.status(500).send('query error : ' + err));
        })
        .catch(err => res.status(500).send('db connection error : ' + err));
});

module.exports = router;