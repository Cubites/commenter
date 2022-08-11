const express = require('express');
const bcrypt = require('bcrypt');
// const dotenv = require('dotenv');
// const path = require('path');
const mariadb = require('mariadb');
const jwt = require('jsonwebtoken');
const router = express.Router();

// dotenv.config({path: path.resolve(__dirname, '../.env')});

const { accessToken } = require('./jwt');
const { authenticated } = require('./auth');

const Mariadb = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    bigIntAsNumber: true
});


async function tokenCompare(plainData, id_token, same_return) {
    console.log('유저 정보 비교');
    console.log(plainData);
    await bcrypt.compareSync(plainData, id_token.token, (err, isMatch) => {
        console.log(isMatch);
        if(isMatch) return id_token.id;
        return 0;
    });
}

// login
const newUserCheck = (req, res, next) => {
    req.body.user_id = 0;
    Mariadb.getConnection()
        .then(conn => {
            conn.query(`select id, ${req.body.login_method}_token as token from user where ${req.body.login_method}_token is not null;`)
                .then(tokens => {
                    console.log('--- 1. 같은 로그인 api를 사용하는 유저 데이터 호출 ---');
                    console.log(tokens[0]);
                    console.log('---------------------------------');
                    tokens.forEach(id_token => {
                        console.log('1-1. tokens');
                        console.log(req.body);
                        req.body.user_code = tokenCompare(req.body.user_code, id_token, req.body.user_id);
                        // bcrypt.compareSync(req.body.user_code, id_token.token, (err, isMatch) => {
                        //     console.log('1-2. isMatch : ' + isMatch);
                        //     if(err) {
                        //         res.status(500).send('bcrypt err : ' + err);
                        //     }
                        //     if(isMatch){
                        //         req.body.user_id = id_token.id;
                        //     }
                        // });
                    });
                })
                .then(() => {
                    console.log('2. 기존 유저인지 확인한 후, user_id 값 출력');
                    console.log('3. user_id : ' + req.body.user_id + '(값이 0이면 신규유저, 0이 아니면 기존 유저');
                    if(req.body.user_id === 0){
                        console.log('4-1-1. 신규유저로 판단, db에 유저 정보 저장 시작');
                        // 기존의 유저가 아닌 경우, 유저 정보 저장
                        bcrypt.genSalt(Number(process.env.SALT_ROUNDS), function (err, salt){
                            if(err) res.status(500).send("bcrypt salt err" + err);
                            bcrypt.hash(req.body.user_code, salt, function (err, hash){
                                if(err) res.status(500).send("bcrypt hash err" + err);
                                conn.query(`select Max(id) as last_user_num from user;`) // id값 생성을 위한 유저 수 호출
                                    .then(userCount => {
                                        let newUserId = userCount[0].last_user_num + 1;
                                        conn.query(`
                                            insert user(id, nickname, ${req.body.login_method}_token)
                                                value(${newUserId}, '${(Math.round(Math.random() * 1000000))}', '${hash}');
                                        `)
                                        .then(() => {
                                            console.log('4-1-2. 신규 유저 등록 완료');
                                            next();
                                        })
                                        .catch(err => res.status(500).send('err that insert user in db : ' + err));
                                    }).catch(err => res.status(500).send('error when call max id : ' + err));
                            });
                        });
                    }else{
                        console.log('4-2. 기존에 있던 유저로 판단');
                        next(); // 기존 유저면 id값을 req에 바로 넣고, 신규 유저면 db 유저 정보 저장 후 id값을 req에 넣음
                    }  
                }).catch(err => res.status(500).send('error when call number of user that have same login_method : ' + err));
        }).catch(err => res.status(500).send('db connection error (newUserCheck) : ' + err));
}

router.post('/user/login', newUserCheck, (req, res, next) => {
    console.log('5. 기존, 신규 유저 확인 완료');
    console.log('user_id : ' + req.body.user_id + '(값이 0이면 신규유저, 0이 아니면 기존 유저');
    if(req.body.user_id !== 0){
        console.log('6-1. 기존 유저이므로 accessToken 발급 후 종료');
        res.status(200).send({accessToken: accessToken(req.body)});
        res.end();
    }else{
        console.log('6-2. 신규 유저로 확인, db에 유저정보가 제대로 저장되었는지 확인');
        Mariadb.getConnection()
        .then(conn => {
            conn.query(`select id, ${req.body.login_method}_token as token from user where ${req.body.login_method}_token is not null;`)
                .then(tokens => {
                    console.log('--- 7. 같은 로그인 api를 사용하는 유저 데이터 호출 ---');
                    console.log(tokens);
                    // console.log(tokens.length); // 열 데이터가 없으면 0, 있으면 열 갯수 출력
                    tokens.forEach(id_token => {
                        bcrypt.compare(req.body.user_code, id_token.token, (err, isMatch) => {
                            if(err) res.status(500).send('bcrypt err : ' + err);
                            console.log('8. 신규 유저 정보와 db에 저장한 신규 유저 정보가 일치하는지 확인');
                            console.log('8-1. isMatch : ' + isMatch);
                            if(isMatch){
                                console.log('9. 신규 유저 정보가 db에 이상없이 저장됨을 확인');
                                req.body.user_id = id_token.id;
                                res.status(200).send({accessToken: accessToken(req.body)});
                                res.end();
                                return;
                            }
                        });
                    });           
                }).catch(err => res.status(500).send('error when call number of user that have same login_method : ' + err));
        }).catch(err => res.status(500).send('db connection error (newUserCheck) : ' + err));
    }
});

module.exports = router;