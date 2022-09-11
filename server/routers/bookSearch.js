const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/book/search', async (req, res, next) => {
    console.log('2-1. 책 검색');
    try{
        const conn = await ConnectionPool.getConnection();
        try{
            // 1. 검색어에 대한 책 목록 조회
            // * 로그인 상태인 경우 - 로그인한 유저가 좋아요한 책인가 정보 요청
            // * 로그인 상태가 아닌 경우 - 로그인한 유저가 좋아요한 책인가 정보 요청 X
            let books = await conn.query(`
                SELECT 
                    bk.isbn
                    , bk.book_title
                    , bk.image_url
                    , bk.author
                    , bk.publisher
                    , bk.publication
                    , bk.discount
                    , bk.sale_link
                    , (SELECT COUNT(*) FROM book_favor bf1 WHERE bf1.isbn = bk.isbn) as like_num
                    ${
                        req.body.user_id !== null ?
                        `, (SELECT is_book_favor FROM book_favor bf2 where bf2.user_id = '${req.body.user_id}' and bf2.isbn = bk.isbn) as like_set` :
                        `null AS like_set`
                    }
                FROM book bk
                WHERE book_title LIKE '%${req.body.search}%'
                ORDER BY ${req.body.sort === '0' ? 'bk.publication' : 'like_num'} DESC
                LIMIT ${Number(req.body.item_size) * (Number(req.body.page_num) - 1)}, ${Number(req.body.item_size)};
            `);
            conn.release();
            res.status(200).send(books);
        }catch(err){
            conn.release();
            console.log('2-1-2. 책 검색 처리 중 에러');
            console.log(err);
            res.status(404).send({success: false, err: err});
        }
    }catch(err){
        console.log('2-1-2. 책 검색 DB 연결 에러');
        console.log(err);
        res.status(404).send({success: false, err: err});
    }
});

module.exports = router;