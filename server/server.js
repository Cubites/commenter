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
app.post('/user/login', login, (req, res) => {
    if(!req.body.login_success){
        res.status(401).send({login_success: false});
    }else{
        accToken = accessToken(req.body.user_id, process.env.JWT_SECRET_KEY);
        res.cookie('auth_a', req.body.user_id, {httpOnly: true, signed: true})
            .status(200)
            .send({login_success: true});
    }
    // let expireDate = new Date(Date.now() + 10 * 1000);
    // res.cookie('auth', req.body.user_code, { expires: expireDate, httpOnly: true, signed: true})
    //     .status(200)
    //     .send({loginSuccess: true});
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