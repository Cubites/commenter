const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/book/search', async (req, res, next) => {
    console.log('2-1. 책 검색');
    const conn = await ConnectionPool.getConnection();
    try{
        // 1. 검색어에 대한 책 목록 조회
        // * 로그인 상태인 경우 - 책에 대한 좋아요 정보 요청
        // * 로그인 상태가 아닌 경우 - 책에 대한 좋아요 정보 요청 X
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
                , (SELECT COUNT(*) FROM book_favor WHERE isbn = bk.isbn) as like_num
                ${
                    req.body.user_id !== null ?
                    `, (SELECT is_book_favor FROM book_favor where user_id = '${req.body.user_id}' and isbn = bk.isbn) as like_set` :
                    ``
                }
            FROM book bk
            WHERE book_title LIKE '%${req.body.search}%'
            ORDER BY ${req.body.set === '0' ? 'bk.publication' : 'like_num'} DESC
            LIMIT ${Number(req.body.item_size) * (Number(req.body.page_num) - 1)}, ${Number(req.body.item_size)};
        `);
        conn.release();
        res.status(200).send(books);
    }catch(err){
        console.log('2-1-2. 책 검색 에러');
        console.log(err);
        conn.release();
        res.status(404).send({success: false, err: err});
    }
});

module.exports = router;