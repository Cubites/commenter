const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/book/info', async (req, res, next) => {
    console.log('4-1. 책 상세정보 조회 시작');
    try{
        const conn = await ConnectionPool.getConnection();
        const bookData = await conn.query(`
            select * from book where isbn = ${req.body.isbn};
        `);
        res.status(200).send('책 상세정보 조회');
    }catch(err){
        console.log('4-1-1. 책 상세정보 조회 에러');
        console.log(err);
        res.status(404).send({success: false});
    }
});


module.exports = router;