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

app.get('/home', (req, res) => {
    console.log('메인 페이지');
    axios.get('https://openapi.naver.com/v1/search/book.json?d_isbn=9791158392406')
        .then(data => res.send(data))
        .catch(err => console.log(err));
});

app.listen(app.get('port'), () => {
    console.log(app.get('port') + '번 포트에서 실행 중...');
});