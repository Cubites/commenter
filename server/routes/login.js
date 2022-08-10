const express = require('express');
const bcrypt = require('bcrypt');
// const dotenv = require('dotenv');
// const path = require('path');
const mariadb = require('mariadb');
const jwt = require('jsonwebtoken');
const router = express.Router();

// dotenv.config({path: path.resolve(__dirname, '../.env')});

const { isLoggedIn, isJoined } = require('./middlewares');
const { authenticated } = require('./auth');

const Mariadb = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    bigIntAsNumber: true
});

// login
router.post('/user/login', authenticated, (req, res, next) => {
    Mariadb.getConnection()
        .then(conn => {
            conn.query(`select ${req.body.login_method}_token as token from user;`)
                .then(data => {
                    console.log("token search : " + data);
                    // 열(유저)이 하나도 없으면 data[0] === undefined
                    // 열(유저)는 있으나 토큰값이 없는 경우 data[0].token === null
                    if(data[0] !== undefined){ // 유저가 한명이라도 있는 경우
                        console.log("No User filtered : " + data[0]);
                        data.forEach(datum => {
                            if(datum.token !== null){ // 해당 유저가 입력받은 유저와 같은 로그인 API(네이버, 카카오)를 쓰는 경우
                                console.log("data : " + datum);
                                bcrypt.compare(req.body.user_code, datum.token, (err, isMatch) => {
                                    console.log(isMatch);
                                    if(err){
                                        res.status(500).send("bcrypt error : " + err);
                                    }else{
                                        if(isMatch){
                                            res.status(200).send('기존에 있는 사용자입니다.');
                                        }else{
                                            conn.query(`
                                                insert into user (id, nickname, ${req.body.login_method}_token)
                                                    value (${user_count[0].num + 1}, '${(Math.round(Math.random() * 1000000))}', '${req.body.user_code}');
                                            `);
                                            res.status(200).send('신규 유저입니다. 저장했습니다.');
                                        }
                                    }
                                });
                            }
                        });
                    }else{
                        conn.query(`
                            insert into user (id, nickname, ${req.body.login_method}_token)
                                value (${user_count[0].num + 1}, '${(Math.round(Math.random() * 1000000))}', '${req.body.user_code}');
                        `);
                        res.status(200).send('신규 유저입니다. 저장했습니다.');
                    }
                })
                .catch(err => res.status(500).send('query error to load from db : ' + err));
        })
        .catch(err => res.status(500).send('db connection error : ' + err));
});

module.exports = router;