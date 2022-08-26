const router = require('express').Router();
const axios = require('axios');

const ConnectionPool = require('../modules/ConnectionPool');

/*
    * 검색 종류 
        - 전체 검색(query=검색내용)
        - 책 제목 검색(d_titl=책제목)
        - ISBN 검색(d_isbn=isbn값)
    * 검색 옵션
        - 검색결과 출력 건수(display=출력갯수)
        - 검색 시작위치(start=검색위치숫자)
        - 정렬 옵션(sort=sim(유사도순) or sort=date(출간일순))
*/
router.get('/book/add', (req, res, next) => {
    console.log("ad-1. 도서 추가");
    console.log(req.query);
    let options = {
        method: 'get',
        url: 'https://openapi.naver.com/v1/search/book.json',
        headers: {
            'X-Naver-Client-Id':process.env.NAVER_CLIENT_ID, 
            'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
        },
        params: req.query
    };

    axios(options)
        .then((rs) => {
            console.log("ad-1-1. api 데이터 요청 성공");
            req.body.isResponseBooks = true;
            console.log(rs.data.items[0]);
            req.body.items = rs.data.items;
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
            // res.status(200).send(req.body.items);
            const conn = await ConnectionPool.getConnection();
            console.log('req.body.items : ', req.body.items);
            req.body.items.forEach(async (item, index) => {
                console.log('item.title :', item.title);
                try{
                    let checkDuplication = conn.query(`select count(*) from book where isbn = ${item.isbn}`);
                    console.log(checkDuplication);
                    await conn.query(`
                        insert book (isbn, book_title, image_url, author, publisher, publication, discount, sale_link)
                            value (?, ?, ?, ?, ?, ?, ?, ?)`, [
                            item.isbn,
                            item.title,
                            item.image,
                            item.author,
                            item.publisher,
                            item.pubdate,
                            item.discount,
                            item.link
                            ]);
                }catch(err){
                    if(err.code === 'ER_DUP_ENTRY'){
                        console.error(`${index}번째 책은 이미 등록된 책입니다.`);
                    }else{
                        console.log('확인되지 않은 에러입니다.');
                        console.log(err);
                    }
                }
            });
            console.log('bookUpload : ', bookUpload);
            console.log('ad-1-3. DB에 책 정보 추가 성공');
            res.status(200).send({
                isResponseBooks: req.body.isResponseBooks,
                bookAddSuccess: true,
                items: req.body.items
            });
            conn.release();
        }catch(err){
            console.log('ad-1-3. DB 연결 에러');
            console.log(err);
            res.status(400).send({
                isResponseBooks: req.body.isResponseBooks,
                bookAddSuccess: false,
                items: req.body.items
            });
        }
    }
})

module.exports = router;