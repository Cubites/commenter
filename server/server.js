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
/* app.use(cors(corsOptions)); */

app.set('port', 4000);


// Router
const poolTokenAuth = require('./routers/poolTokenAuth');

// test
app.all('/test', cors(corsOptions), (req, res) => {
    res.status(200).send({connection: true});
});

// Routers
const Book = require('./routers/Book');
const Comment = require('./routers/Comment');
const Qna = require('./routers/Qna');
const User = require('./routers/User');

// 0. 로그인 토큰 유효성 검사
app.use(poolTokenAuth);

app.post('/book/*', Book);
// app.post('/book/*', cors(corsOptions), Book);

app.post('/comment/*', Comment);

app.post('/qna/*', Qna);

app.post('/user/*', User);

app.listen(app.get('port'), () => {
    console.log(`app listening on port ${app.get('port')}...`);
});