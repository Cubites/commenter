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
// app.use(cookieParser(process.env.COOKIE_SECRET_KEY));
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

app.set('port', 4000);

const { accessToken, refressToken, accessTokenVerify } = require('./routes/jwt');

// Router
const login = require('./routes/login.js');

// const Mariadb = mariadb.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE,
//     dateStrings: 'date'
// });

app.use('/', (req, res, next) => {
    console.log('--- 쿠키 찾기 1 ---');
    console.log(req.signedCookies);
    console.log('-------------------');
    if(req.signedCookies.auth !== undefined){
        let tokenCheck = accessTokenVerify(req.signedCookies.auth.accessToken, process.env.JWT_SECRET_KEY);
        if(tokenCheck === null);
    }
    // req.body.isLogout = accessTokenVerify() // 로그인 유지 확인용 값(isLogout)
    next();
});

// app.use('/', login);
app.post('/user/login', login, (req, res) => {
    if(!req.body.login_success){
        res.status(401).send({login_success: false, isLogout: true});
    }else{
        accToken = accessToken(req.body.user_id, process.env.JWT_SECRET_KEY);
        console.log(accToken);
        res.cookie('auth', {user_id: req.body.user_id, accessToken : accToken}, {httpOnly: true, signed: true});
        res.status(200)
            .send({user_id: req.body.user_id, login_success: true, isLogout: false});
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
            res.send(200, { "data": rs.data.items });
        })
        .catch(err => res.send(err));
    }
);

app.listen(app.get('port'), () => {
    console.log(`app listening on port ${app.get('port')}...`);
});