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

const { accessToken, refressToken } = require('./modules/jwt');
const { accessCheck } = require('./routers/auth');
// const tokenAuth = require('./routes/tokenAuth');

// Router
const login = require('./routers/login.js');

const conn = mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    bigIntAsNumber: true,
    connectionLimit: 4
});

const tokenAuth = require('./routers/tokenAuth'); // 토큰 유효성 검사 router

app.use(tokenAuth);

app.post('/test', tokenAuth, (req, res, next) => {
    console.log(req.body);
    res.status(200).send('/test 통신 정상');
});

app.post('/user/login', login, (req, res) => {
    res.status(200).send('login 절차 실행 완료');
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