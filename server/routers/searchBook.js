const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/book/search', async (req, res, next) => {
    console.log('2-1. 책 검색');
    const conn = await ConnectionPool.getConnection();
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
            , (SELECT is_book_favor FROM book_favor where user_id = '${req.body.user_id}' and isbn = bk.isbn) as like_set
        FROM book bk
        WHERE book_title LIKE '%${req.body.search}%'
        ORDER BY ${req.body.set === '0' ? 'bk.publication' : 'like_num'} DESC
        LIMIT ${Number(req.body.item_size) * (Number(req.body.page_num) - 1)}, ${Number(req.body.item_size)};
    `);
    res.status(200).send(books);
});

module.exports = router;