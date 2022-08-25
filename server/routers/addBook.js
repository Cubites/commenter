const router = require('express').Router();
const axios = require('axios');

const ConnectionPool = require('../modules/ConnectionPool');

router.get('/book/add', (req, res, next) => {
    console.log("ad-1. 도서 추가");
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
            console.log("ad-1-1. api 데이터 요청 성공");
            req.body.isResponseBooks = true;
            req.body.books = rs.data.items;
            next();
        })
        .catch(err => {
            console.log('add-1-1. 책 정보 요청 에러');
            res.send(err);
            req.body.isResponseBooks = false;
            next();
        });
    }
);

router.get('/book/add', async (req, res, next) => {
    if(req.body.isResponseBooks){
        try{
            console.log('ad-1-2. DB에 책 정보 추가');
            const conn = await ConnectionPool.getConnection();
            const bookUpload = await conn.query();
        }catch(err){
            console.log('ad-1-3. DB 연결 에러');
        }
    }
})

module.exports = router;