const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/user/info', async (req, res, next) => {
    console.log('8. 마이 페이지 조회');
    try{
        const conn = await ConnectionPool.getConnection();
        const userData = await conn.query(`
            SELECT 
                ui.user_id
                , ui.nickname
                , ui.intro
                , count(distinct cm.comment_id) comment_cnt
                , sum(cf.is_comment_favor) favor_cnt
            from user_info ui
                inner join comment cm 
                on ui.user_id = cm.user_id
                inner join comment_favor cf
                on cm.comment_id = cf.comment_id
            where ui.user_id = '${req.body.user_id}';
        `);
        const bookFavorData = await conn.query(`
            SELECT 
                bk.isbn
                , bk.book_title 
                , bk.image_url 
            FROM book_favor bf
                INNER JOIN book bk 
                ON bf.isbn = bk.isbn 
            where bf.user_id = '${req.body.user_id}';
        `);
        res.status(200).send({...userData[0], book_favor: bookFavorData});
    }catch(err){

    }
});

module.exports = router;