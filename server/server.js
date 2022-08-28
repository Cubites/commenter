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

const { accessToken, refressToken } = require('./routes/jwt');

// const Mariadb = mariadb.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_DATABASE
// });

// Router
const login = require('./routes/login.js');

app.use('/', (req, res, next) => {
    console.log(req.signedCookies.cookie);
    // let isLogin = refressToken();
    next();
});

// app.use('/', login);
// app.post('/user/login', login, (req, res) => {
//     if(!req.body.login_success){
//         res.status(401).send({login_success: false});
//     }else{
//         accToken = accessToken(req.body.user_id, process.env.JWT_SECRET_KEY);
//         res.cookie('auth_a', req.body.user_id, {httpOnly: true, signed: true})
//             .status(200)
//             .send({login_success: true});
//     }
//     // let expireDate = new Date(Date.now() + 10 * 1000);
//     // res.cookie('auth', req.body.user_code, { expires: expireDate, httpOnly: true, signed: true})
//     //     .status(200)
//     //     .send({loginSuccess: true});
// });

// 1.책 조회
app.get('/book/search', (req, res) => {
    console.log("서버입장");
    console.log(req.query.search);
    console.log(req.query.sort);

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

// 2. 책 정보
app.get('/book/info', (req, res) => {
    console.log("서버입장");
    console.log(req.query.id);

    let data = {
        id : '1',
        book_name : '테스트 북',
        writer : 'commenter',
        like_num : 9,
        image_url : 'https://post-phinf.pstatic.net/MjAyMjA2MTNfMTMx/MDAxNjU1MDg2OTg2OTE3.YXxMSvXx2hQXjBAKOTfEenX0evyHdTpBhnrEgulm_sAg.FK-i9lgQ0SQvN6k58FmRFHoK6M-igA6lm4lP8eaYrHIg.JPEG/image_3768699671655086970033.jpg'
    };
    console.log("api 데이터 요청 성공");
    res.send(200, data);
});

// 3. 코멘트 조회
app.get('/comment/info', (req, res) => {
    console.log("서버입장");
    console.log(req.query.book_id);
    console.log(req.query.sort);

    let data = {
        book_id : '1',
        date : '2021-05-04',
        content : '기말 A+',
        nickname : '대학웑죽어',
        like_num : '150',
        report : '0'
    };
    console.log("api 데이터 요청 성공");
    res.send(200, data);
});

// 4. 코멘트 등록
app.get('/comment/insert', (req, res) => {
    console.log("서버입장");
    console.log(req.query.book_id);
    console.log(req.query.content);
    console.log(req.query.ip);
    let data = {
        success : 0,
        fail_reason : ''
    };
    console.log("api 데이터 요청 성공");
    res.send(200, data);
});


// 5. 코멘트 신고
app.get('/comment/insert', (req, res) => {
    console.log("서버입장");
    console.log(req.query.comment_id);
    console.log(req.query.comment_content);

    let data = {
        success : 0,
        fail_reason : ''
    };
    console.log("api 데이터 요청 성공");
    res.send(200, data);
});


// 6. 코멘트 삭제
app.get('/comment/delete', (req, res) => {
    console.log("서버입장");
    console.log(req.query.comment_id);

    let data = {
        success : 0,
        fail_reason : ''
    };
    console.log("api 데이터 요청 성공");
    res.send(200, data);
});

// 7. 로그인
app.get('/user/login', (req, res) => {
    console.log("서버입장");
    console.log(req.query.login_method);
    console.log(req.query.user_code);
    let user_id = req.query.user_code;
    
    let data = {
        user_id : user_id,
        login_token : 'AAAAAAA',
        user_nick : '냥군'
    };
    console.log("api 데이터 요청 성공");
    res.send(200, data);
});

// 8. 마이페이지
// app.get('/user/info', (req, res) => {
//     console.log("서버입장");
//     console.log(req.query.user_id);

//     let data = {
//         comment_num : '50',
//         favor_num : '100',
//         bookmarks : '00001_https://post-phinf.pstatic.net/MjAyMjA2MTNfMTMx/MDAxNjU1MDg2OTg2OTE3.YXxMSvXx2hQXjBAKOTfEenX0evyHdTpBhnrEgulm_sAg.FK-i9lgQ0SQvN6k58FmRFHoK6M-igA6lm4lP8eaYrHIg.JPEG/image_3768699671655086970033.jpg',
//         comments : '00002_https://post-phinf.pstatic.net/MjAyMjA2MTNfMTMx/MDAxNjU1MDg2OTg2OTE3.YXxMSvXx2hQXjBAKOTfEenX0evyHdTpBhnrEgulm_sAg.FK-i9lgQ0SQvN6k58FmRFHoK6M-igA6lm4lP8eaYrHIg.JPEG/image_3768699671655086970033.jpg'
//     };
//     console.log("api 데이터 요청 성공");
//     res.send(200, data);
// });

// 9. 유저 정보 수정
app.get('/user/update', (req, res) => {
    console.log("서버입장");
    console.log(req.query.user_nick);
    console.log(req.query.user_profile);

    let data = {
        success : 0,
        fail_reason : ''
    };
    console.log("api 데이터 요청 성공");
    res.send(200, data);
});
// 10. 문의 전송
app.get('/qna/insert', (req, res) => {
    console.log("서버입장");
    console.log(req.query.qna_reason);
    console.log(req.query.qna_content);

    let data = {
        success : 0,
        fail_reason : ''
    };
    console.log("api 데이터 요청 성공");
    res.send(200, data);
});

// 11. 문의 조회
app.get('/qna/search', (req, res) => {
    console.log("서버입장");
    console.log(req.query.user_id);

    let data = {
        report_date : '2019.05.21',
        report_content : '테스트 내용',
        report_answer : ''
    };
    console.log("api 데이터 요청 성공");
    res.send(200, data);
});

// 12. 문의 상세 조회
app.get('/qna/info', (req, res) => {
    console.log("서버입장");
    console.log(req.query.qna_id);

    let data = {
        report_date : '2019.05.21',
        report_content : '테스트 내용',
        report_answer : ''
    };
    console.log("api 데이터 요청 성공");
    res.send(200, data);
});

app.listen(app.get('port'), () => {
    console.log(`app listening on port ${app.get('port')}...`);
});