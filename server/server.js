const express = require('express');
const dotenv = require('dotenv');
const mariadb= require('mariadb/callback');
const axios = require('axios');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
dotenv.config();
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

app.set('port', 4000);

// Router
const poolLogin = require('./routers/poolLogin');
const poolTokenAuth = require('./routers/poolTokenAuth');
const addbook = require('./routers/addBook');

// 로그인 토큰 유효성 검사
app.use(poolTokenAuth);

app.use('/test', (req, res) => {
    res.status(200).send(req.body);
});

// 로그인 & 회원가입
app.post('/user/login', poolLogin, (req, res) => {
    console.log('Access Token 최종 확인 : ' + req.body.access_token);
    res.cookie('auth', {user_id: req.body.user_id, access_token: req.body.access_token}, {httpOnly: true, signed: true})
        .status(200).send({loginSuccess: true, data: req.body});
});


// 도서 추가
app.get('/book/add', addbook);

app.listen(app.get('port'), () => {
    console.log(`app listening on port ${app.get('port')}...`);
});