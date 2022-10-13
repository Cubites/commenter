const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
dotenv.config();
app.use(cookieParser(process.env.COOKIE_SECRET_KEY));

let corsOptions = {
    origin: [
        'http://54.180.18.215',
        'http://commenter.link',
        'https://54.180.18.215',
        'https://commenter.link'
    ]
};
app.use(cors(corsOptions));

app.set('port', 4000);

// Router
const poolTokenAuth = require('./routers/poolTokenAuth');
const addbook = require('./routers/addBook');

const bookSearch = require('./routers/bookSearch');
const bookInfo = require('./routers/bookInfo');
const commentInsert = require('./routers/commentInsert');
const commentInfo = require('./routers/commentInfo');
const commentReport = require('./routers/commentReport');
const commentDelete = require('./routers/commentDelete');
const userLogin = require('./routers/userLogin');
const userInfo = require('./routers/userInfo');
const userUpdate = require('./routers/userUpdate');
const qnaInsert = require('./routers/qnaInsert');
const qnaSearch = require('./routers/qnaSearch');
const qnaInfo = require('./routers/qnaInfo');

// test
app.all('/test', (req, res) => {
    res.status(200).send({connection: true});
});

// 0. 로그인 토큰 유효성 검사
app.use(poolTokenAuth);

// ad-1. 도서 추가
app.post('/book/add', addbook);

// 1. 검색 페이지 도서 조회
app.post('/book/search', cors(corsOptions), bookSearch)
// app.post('/book/search', bookSearch);

// 2. 책 페이지 책 데이터 조회
app.post('/book/info', bookInfo);

// 3. 코멘트 등록
app.post('/comment/insert', commentInsert);

// 4. 코멘트 조회
app.post('/comment/info', commentInfo);

// 5. 코멘트 신고
app.post('/comment/report', commentReport);

// 6. 코멘트 삭제
app.post('/comment/delete', commentDelete);

// 7. 로그인 & 회원가입
app.post('/user/login', userLogin);

// 8. 마이페이지 정보(유저 정보) 조회
app.post('/user/info', userInfo);

// 9. 유저 정보 수정
app.post('/user/update', userUpdate);

// 10. 문의 전송
app.post('/qna/insert', qnaInsert);

// 11. 문의 조회
app.post('/qna/search', qnaSearch);

// 12. 문의 상세 조회
app.post('/qna/info', qnaInfo);

app.listen(app.get('port'), () => {
    console.log(`app listening on port ${app.get('port')}...`);
});