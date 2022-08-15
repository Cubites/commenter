const express = require('express');
const bcrypt = require('bcrypt');
// const dotenv = require('dotenv');
// const path = require('path');
const mariadb = require('mariadb');
const jwt = require('jsonwebtoken');
const router = express.Router();

// dotenv.config({path: path.resolve(__dirname, '../.env')});

const { accessToken, refressToken } = require('./jwt');

const Mariadb = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// login
const newUserCheck = (req, res, next) => {
    req.body.user_id = 0;
    if(req.body.login_method != 'n' && req.body.login_method != 'k'){
        res.status(404).send('잘못된 접근입니다.');
    }else{
        Mariadb.getConnection()
        .then(conn => {
            // user_code로 db를 조회하여 신규 유저인지 판별
            conn.query(`select id, ${req.body.login_method}_token as token from user where ${req.body.login_method}_token = '${req.body.user_code}';`)
                .then(userInfo => {
                    if(userInfo.length !== 0){ // 기존 유저인 경우 id값을 넘김
                        req.body.user_id = userInfo.id;
                        req.body.login_success = true;
                        conn.release();
                        next();
                    }else{ // 신규 유저인 경우 db에 등록
                        conn.query(`select Max(id) as last_user_num from user;`)
                        .then(userCount => {
                            let newUserId = userCount[0].last_user_num + 1;
                            conn.query(`
                                insert user(id, nickname, ${req.body.login_method}_token)
                                    value(${newUserId}, '${(Math.round(Math.random() * 1000000))}', '${req.body.user_code}');
                            `)
                                .then(() => {
                                    req.body.login_success = true;
                                    conn.release();
                                    next();
                                }).catch(err => {
                                    req.body.login_success = false;
                                    console.log('err that insert userInfo in db : ' + err);
                                    next();
                                });
                        }).catch(err => {
                            req.body.login_success = false;
                            console.log('error when call max id : ' + err);
                            next();
                        });
                    }
                }).catch(err => {
                    req.body.login_success = false;
                    console.log('error when call number of user that have same login_method : ' + err);
                    next();
                });
        }).catch(err => {
            console.log('db connecting error' + err);
            res.status(500).send('db connecting error');
        });
    }
}

router.post('/user/login', newUserCheck, (req, res, next) => {
    if(!req.body.login_success){
        next();
    }else{
        if(req.body.user_id !== 0){ // 유저가 확인됐으므로 로그인 성공
            req.body.login_success = true;
            next();
        }else{ // 신규 유저인 경우 db에 유저정보가 제대로 저장되었는지 확인 후, accessToken 발급
            Mariadb.getConnection()
                .then(conn => {
                    // user_code로 db를 조회하여 유저 조회
                    conn.query(`
                        select id, ${req.body.login_method}_token as token from user 
                            where ${req.body.login_method}_token = '${req.body.user_code}';
                    `)
                        .then(userInfo => {
                            if(userInfo.length !== 0){
                                req.body.user_id = userInfo.id;
                                req.body.login_success = true;
                                conn.release();
                                next()
                            }else{
                                req.body.login_success = false;
                                console.log("Can't not find newUserInfo.");
                                conn.release();
                                next();
                            }
                        }).catch(err => {
                            req.body.login_success = false;
                            console.log('error when call number of user that have same login_method : ' + err)
                        });
                }).catch(err => {
                    req.body.login_success = false;
                    console.log('db connection error (newUserCheck) : ' + err);
                });
        }
    }
});

module.exports = router;