const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
dotenv.config();
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

app.set('port', 4000);

// Router
const poolTokenAuth = require('./routers/poolTokenAuth');
const addbook = require('./routers/addBook');
const bookSearch = require('./routers/bookSearch');
const bookInfo = require('./routers/bookInfo');
const commentInsert = require('./routers/commentInsert');
const commentInfo = require('./routers/commentInfo');
const userLogin = require('./routers/userLogin');
const userInfo = require('./routers/userInfo');

// 0. 로그인 토큰 유효성 검사
app.use(poolTokenAuth);

app.use('/test', (req, res) => {
    res.status(200).send(req.body);
});

// ad-1. 도서 추가
app.post('/book/add', addbook);

// 1. 검색 페이지 도서 조회
app.post('/book/search', bookSearch);

// 2. 책 페이지 책 데이터 조회
app.post('/book/info', bookInfo);

// 3. 코멘트 등록
app.post('/comment/insert', commentInsert);

// 4. 코멘트 조회
app.post('/comment/info', commentInfo);

// 5. 코멘트 신고

// 6. 코멘트 삭제

// 7. 로그인 & 회원가입
app.post('/user/login', userLogin, (req, res) => {
    console.log('Access Token 최종 확인 : ' + req.body.access_token);
    res.cookie('auth', {user_id: req.body.user_id, access_token: req.body.access_token}, {httpOnly: true, signed: true})
        // .status(200).send({loginSuccess: true, data: req.body});
        .status(200).send({loginSuccess: true});
});

// 8. 마이페이지 정보(유저 정보) 조회
app.post('/user/info', userInfo);

// 9. 유저 정보 수정

// 10. 문의 전송

// 11. 문의 조회

// 12. 문의 상세 조회

app.listen(app.get('port'), () => {
    console.log(`app listening on port ${app.get('port')}...`);
});