const express = require('express');
const dotenv = require('dotenv');
const mariadb= require('mariadb/callback');
const axios = require('axios');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
dotenv.config();

app.set('port', 4000);

const Mariadb = mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

let client_id = process.env.NAVER_CLIENT_ID;
let client_secret = process.env.NAVER_CLIENT_SECRET;
app.get('/search/book', (req, res) => {
    console.log("서버입장");
    console.log(req.query.name);
    let options = {
        method: 'get',
        url: 'https://openapi.naver.com/v1/search/book.json',
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret},
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
    console.log(`http://localhost:${app.get('port')}/search/blog?query=검색어 app listening on port ${app.get('port')}...`);
});