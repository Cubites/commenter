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
const searchBook = require('./routers/searchBook');
const addComment = require('./routers/addComment');
const bookDetail = require('./routers/bookDetail');

// 0. 로그인 토큰 유효성 검사
app.use(poolTokenAuth);

app.use('/test', (req, res) => {
    res.status(200).send(req.body);
});

// 1. 로그인 & 회원가입
app.post('/user/login', poolLogin, (req, res) => {
    console.log('Access Token 최종 확인 : ' + req.body.access_token);
    res.cookie('auth', {user_id: req.body.user_id, access_token: req.body.access_token}, {httpOnly: true, signed: true})
        // .status(200).send({loginSuccess: true, data: req.body});
        .status(200).send({loginSuccess: true});
});

// ad-1. 도서 추가
app.post('/book/add', addbook);

// 2. 도서 조회
app.post('/book/search', searchBook);

// 3. 코멘트 등록
app.post('/comment/insert', addComment);

// 4. 책 상세 페이지 조회
app.post('/book/info', bookDetail);

// 5. 코멘트 신고

// 6. 코멘트 삭제

// 7. 마이페이지 정보(유저 정보) 조회

// 8. 유저 정보 수정

// 9. 문의 전송

// 10. 문의 조회

// 11. 문의 상세 조회

app.listen(app.get('port'), () => {
    console.log(`app listening on port ${app.get('port')}...`);
});