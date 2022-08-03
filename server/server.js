const express = require('express');
const dotenv = require('dotenv');
const mariadb= require('mariadb/callback');

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

app.get('/', (req, res) => {
    console.log('메인 페이지');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port') + '번 포트에서 실행 중...');
});