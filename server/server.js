const express = require('express');
const dotenv = require('dotenv');
const mariadb= require('mariadb/callback');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
dotenv.config();
// app.use(cookieParser());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

app.set('port', 4000);

const { accessToken, refressToken } = require('./routes/jwt');
const { accessCheck } = require('./routes/auth');
const tokenAuth = require('./routes/auth');

// Router
const login = require('./routes/login.js');

const conn = mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    bigIntAsNumber: true,
    connectionLimit: 4
});

app.post('/test', tokenAuth, (req, res) => {
    res.status(200).send(req.body.result);
});

app.use('/', (req, res, next) => {
    // console.log('--- 쿠키 찾기 ---');
    // console.log(req.signedCookies);
    // console.log('-------------------');
    if(req.signedCookies.auth !== undefined){ // accessToken이 있는 경우
        console.log('0. accessToken 체크');
        let tokenCheck = accessCheck(req.signedCookies.auth.accessToken, process.env.JWT_SECRET_KEY, conn);
        console.log(tokenCheck);
        if(tokenCheck.accessToken !== null && !tokenCheck.isLogout){
            console.log('0-2. 만료된 access token을 가진 사용자 확인. access token 재발급');
            res.cookie('auth', {user_id: tokenCheck.user_id}, {httpOnly: true, signed: true});
        }else if(tokenCheck.accessToken === null && !tokenCheck.isLogout){
            console.log('0-2. 유효한 access token을 가진 사용자 확인');
            req.body.isLogout = tokenCheck.isLogout; // 로그인 유지 여부(isLogout) req.body에 추가
        }
        if(tokenCheck.isLogout){
            console.log('0-2. 부정한 사용자 확인 로그아웃 처리');
            req.body.isLogout = true;
        }
    }
    next();
});

app.post('/user/login', login, (req, res) => {
    console.log('10. 로그인 절차 완료');
    if(!req.body.login_success){
        console.log('11. 로그인 실패, 실패 결과 전송')
        res.status(401).send({login_success: false, isLogout: true});
    }else{
        console.log('11. 로그인 성공, 토큰 발급 시작');
        if(req.body.isLogout !== undefined){ // isLogout이 존재하는 경우 = accessToken이 존재 > 로그인 시도가 안돼야 함
            console.log('12. 로그인 중, 로그인 시도. 로그인시도는 무시하고 기존 로그인 유지');
            res.status(204).send({user_id: req.body.user_id, isLogout: false});
        }else{
            accToken = accessToken(req.body.user_id, process.env.JWT_SECRET_KEY);
            refToken = refressToken(req.body.user_id, accToken, process.env.JWT_SECRET_KEY);
            console.log(accToken);
            conn.query(`
                insert login_token (user_id, access_token, refresh_token, refresh_expire)
                    values(${req.body.user_id}, '${accToken}', '${refToken.refressToken}', ${refToken.expire});
            `, (err, data) => {
                if(err){
                    console.log('12. 발급한 토큰 저장 실패');
                    console.log(err);
                }else{
                    console.log('12. 발급한 토큰 저장 성공');
                }
            });
            res.cookie('auth', {user_id: req.body.user_id, accessToken : accToken}, {httpOnly: true, signed: true})
                .status(200)
                .send({user_id: req.body.user_id, login_success: true, isLogout: false});
        }
    }
});

app.get('/search/book', (req, res) => {
    console.log("서버입장");
    console.log(req.query.name);
    let options = {
        method: 'get',
        url: 'https://openapi.naver.com/v1/search/book.json',
        headers: {
            'X-Naver-Client-Id':process.env.NAVER_CLIENT_ID, 
            'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
        },
        params: { query: req.query.name }
    };

    axios(options)
        .then((rs) => {
            console.log("api 데이터 요청 성공");
            res.status(200).send({ "data": rs.data.items });
        })
        .catch(err => res.send(err));
    }
);

app.listen(app.get('port'), () => {
    console.log(`app listening on port ${app.get('port')}...`);
});