const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/book/search', async (req, res, next) => {
    console.log('2-1. 책 검색');
    const conn = await ConnectionPool.getConnection();
    let books = await conn.query(`
        select isbn, book_title, author, image_url from book where book_title like '%${req.body.search}%'
            order by publication desc limit ${req.body.item_size * (req.body.page_num - 1)}, ${req.body.item_size}`);
    res.status(200).send(books);
});

module.exports = router;