const express = require('express');
const dotenv = require('dotenv');
const mariadb= require('mariadb/callback');
const axios = require('axios');

const app = express();

app.set('port', 4000);
app.use(express.urlencoded({extended: true}));
app.use(express.json());
dotenv.config();

const Mariadb = mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});


let client_id = process.env.NAVER_CLIENT_ID;
let client_secret = process.env.NAVER_CLIENT_SECRET;
app.get('/search/book', function (req, res) {
    let api_url = 'https://openapi.naver.com/v1/search/book.json?query=%EC%A3%BC%EC%8B%9D&display=10&start=1'; // json 결과
    let request = require('request');
    let options = {
       url: api_url,
       headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret, 'Content-Type': 'application/json'}
    };
    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
            res.end(body);
        } else {
            res.status(response.statusCode).end();
            console.log('error = ' + response.statusCode);
        }
    });
});

app.get('/home', (req, res) => {
    console.log('메인 페이지');
    axios.get('https://openapi.naver.com/v1/search/book.json?d_isbn=9791158392406')
        .then(data => res.send(data))
        .catch(err => console.log(err));
});

app.listen(app.get('port'), () => {
    console.log(app.get('port') + '번 포트에서 실행 중...');
});