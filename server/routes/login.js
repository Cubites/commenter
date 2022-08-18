const express = require('express');
// const dotenv = require('dotenv');
// const path = require('path');
const mariadb = require('mariadb');
const router = express.Router();

// dotenv.config({path: path.resolve(__dirname, '../.env')});

const Mariadb = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    bigIntAsNumber: true,
    connectionLimit: 5
});

// login
const newUserCheck = (req, res, next) => {
    console.log('1. 로그인 시도');
    console.log('2. 신규 or 기존 유저 확인');
    req.body.user_id = 0;
    if(req.body.login_method != 'n' && req.body.login_method != 'k'){
        console.log('3. 잘못된 로그인 방식 시도');
        res.status(404).send('잘못된 접근입니다.');
    }else{
        console.log('3. 올바른 로그인 방식 시도, 신규 or 기존 유저 확인');
        Mariadb.getConnection()
        .then(conn => {
            // user_code로 db를 조회하여 신규 유저인지 판별
            conn.query(`
                select user_id, ${req.body.login_method}_token as token from user 
                    where ${req.body.login_method}_token = '${req.body.user_code}';
                `)
                .then(userInfo => {
                    if(userInfo.length !== 0){ // 기존 유저인 경우 id값을 넘김
                        console.log('4. 기존 유저로 판단, 신원 확인 완료');
                        req.body.user_id = userInfo[0].user_id;
                        req.body.login_success = true;
                        next();
                    }else{ // 신규 유저인 경우 db에 등록
                        console.log('4. 신규 유저로 판단, 회원가입 시작');
                        conn.query(`select Max(user_id) as last_user_num from user;`)
                            .then(userCount => {
                                console.log('5. 신규 유저에게 발급할 user id 생성');
                                let newUserId = userCount[0].last_user_num + 1;
                                conn.query(`
                                    insert user(user_id, nickname, ${req.body.login_method}_token)
                                        value(${newUserId}, '${(Math.round(Math.random() * 1000000))}', '${req.body.user_code}');
                                `)
                                    .then(() => {
                                        console.log('6. 신규 유저 회원가입 성공');
                                        req.body.login_success = true;
                                        next();
                                    }).catch(err => {
                                        req.body.login_success = false;
                                        console.log('err that insert userInfo in db : ' + err);
                                        next();
                                    });
                                conn.release();
                            }).catch(err => {
                                req.body.login_success = false;
                                console.log('error when call max id : ' + err);
                                next();
                            });
                        conn.release();
                    }
                }).catch(err => {
                    req.body.login_success = false;
                    console.log('error when call number of user that have same login_method : ' + err);
                    next();
                });
            conn.release();
        }).catch(err => {
            console.log('db connecting error' + err);
            res.status(500).send('db connecting error');
        });
    }
}

router.post('/user/login', newUserCheck, (req, res, next) => {
    console.log('7. 로그인 절차 실행')
    if(!req.body.login_success){
        next();
    }else{
        if(req.body.user_id !== 0){ // 유저가 확인됐으므로 로그인 성공
            console.log('8. 기존 유저는 신원 확인 완료, 로그인 완료');
            req.body.login_success = true;
            next();
        }else{ // 신규 유저인 경우 db에 유저정보가 제대로 저장되었는지 확인 후, accessToken 발급
            console.log('8. 신규유저 로그인');
            Mariadb.getConnection()
                .then(conn => {
                    // user_code로 db를 조회하여 유저 조회
                    conn.query(`
                        select user_id as id, ${req.body.login_method}_token as token from user 
                            where ${req.body.login_method}_token = '${req.body.user_code}';
                    `)
                        .then(userInfo => {
                            if(userInfo.length !== 0){
                                console.log('9. 신규 유저 데이터가 정상적으로 조회됨, 신원 확인 완료, 로그인 완료')
                                req.body.user_id = userInfo[0].id;
                                req.body.login_success = true;
                                conn.release();
                                next()
                            }else{
                                console.log('9. 신규 유저 데이터 조회 불가, 로그인 실패');
                                req.body.login_success = false;
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