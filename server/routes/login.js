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
router.post('/user/login', (req, res, next) => {
    Mariadb.getConnection()
        .then(conn => {
            // 로그인 시도한 유저와 같은 api인 계정 정보만 호출
            conn.query(`select id, ${req.body.login_method}_token as token from user where not ${req.body.login_method}_token = null;`)
                .then(data => {
                    console.log('--- token search query check ---');
                    console.log(data); // 열 데이터 유무와 관계없이 값 출력
                    console.log(data.length); // 열 데이터가 없으면 0, 있으면 열 갯수 출력
                    console.log(data[0]); // 열 데이터가 없으면 undefined, 있으면 배열 형태로 출력
                    console.log(data[0].token); // 열 데이터가 없으면 에러발생, 열 데이터는 있으나 값이 없으면 null
                    res.status(200).send('token 읽기 성공');

                    // if(data[0] !== undefined){ // 유저가 한명이라도 있는 경우
                    //     console.log("No User filtered : " + data[0].token);
                    //     // data.forEach(datum => {
                    //     //     if(datum.token){ // 해당 유저가 입력받은 유저와 같은 로그인 API(네이버, 카카오)를 쓰는 경우
                    //     //         console.log("data : " + datum.token);
                    //     //         bcrypt.compare(req.body.user_code, datum.token, (err, isMatch) => {
                    //     //             console.log(isMatch);
                    //     //             if(err){
                    //     //                 res.status(500).send("bcrypt error : " + err);
                    //     //             }else{
                    //     //                 if(isMatch){
                    //     //                     res.status(200).send('기존에 있는 사용자입니다.');
                    //     //                 }else{
                    //     //                     let transPassword = authenticated(req.body.user_code);
                    //     //                     res.status(200).send({data: transPassword});
                    //     //                     // conn.query(`
                    //     //                     //     insert into user (id, nickname, ${req.body.login_method}_token)
                    //     //                     //         value (${data.length + 1}, '${(Math.round(Math.random() * 1000000))}', '${transPassword}');
                    //     //                     // `);
                    //     //                     // res.status(200).send('신규 유저입니다. 저장했습니다.');
                    //     //                 }
                    //     //             }
                    //     //         });
                    //     //     }
                    //     // });
                    // }else{
                    //     res.status(200).send('유저가 없습니다.');
                    //     // conn.query(`
                    //     //     insert into user (id, nickname, ${req.body.login_method}_token)
                    //     //         value (${user_count[0].num + 1}, '${(Math.round(Math.random() * 1000000))}', '${req.body.user_code}');
                    //     // `)
                    //     // .then(d => {
                    //     //     console.log(d)
                    //     //     res.status(200).send('신규 유저입니다. 저장했습니다.');
                    //     // })
                    //     // .catch(err => {
                    //     //     res.status(500).send('insert error : ' + err);
                    //     // });
                    // }
                })
                .catch(err => res.status(500).send('query error to load from db : ' + err));
        })
        .catch(err => res.status(500).send('db connection error : ' + err));
});

module.exports = router;