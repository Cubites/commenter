const express = require('express');
const dotenv = require('dotenv');
const mariadb= require('mariadb/callback');
const axios = require('axios');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
dotenv.config();
// app.use(cookieParser());
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

app.set('port', 4000);

// Router
const login = require('./routers/login');
const tokenAuth = require('./routers/tokenAuth'); // 토큰 유효성 검사 router

// 로그인 토큰 유효성 검사
app.use(tokenAuth);

app.use('/test', (req, res) => {
    res.status(200).send('메인페이지');
})

// 로그인 & 회원가입
app.post('/user/login', login, (req, res) => {
    console.log('Access Token 최종 확인(경로: req.body.access_token) : ' + req.body.access_token);
    res.cookie('auth', {user_id: req.body.user_id, access_token: req.body.access_token}, {httpOnly: true, signed: true})
        .status(200).send({loginSuccess: 'login 절차 실행 완료', data: req.body});
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