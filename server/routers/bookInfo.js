const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/book/info', async (req, res, next) => {
    console.log('4-1. 책 상세정보 조회 시작');
    try{
        const conn = await ConnectionPool.getConnection();
        // 1. 도서 정보 + 로그인한 유저의 좋아요
        const bookData = await conn.query(`
        SELECT 
            bk.book_title
            , bk.author
            , bk.publisher
            , bk.image_url
            , bk.discount
            , bk.isbn
            , bk.sale_link
            , (
                SELECT 
                    is_book_favor
                FROM book_favor bf WHERE user_id = '${req.body.user_id}' and isbn = bk.isbn
            ) AS book_favor
        FROM book bk
        WHERE bk.isbn = '${req.body.isbn}';
        `);
        
        const tagData = await conn.query(`
            SELECT
                tg.tag_id
                , tg.tag_name
            FROM tag tg
                INNER JOIN book_tag bt 
                on bt.tag_id = tg.tag_id
                INNER JOIN book bk 
                ON bk.isbn = bt.isbn
            WHERE bk.isbn = '${req.body.isbn}';
        `);
        conn.release();
        res.status(200).send({
            ...bookData[0],
            tag: tagData
        });
    }catch(err){
        console.log('4-1-1. 책 상세정보 조회 에러');
        console.log(err);
        conn.release();
        res.status(404).send({success: false, err: err});
    }
});


module.exports = router;