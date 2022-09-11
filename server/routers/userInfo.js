const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/user/info', async (req, res, next) => {
    console.log('8-1. 마이 페이지 조회');
    if(req.body.user_id === null){
        console.log('8-1-1. 로그인 상태가 아님. 에러 출력');
        res.status(404).send({success: false, reason: '잘못된 접근입니다.'});
    }else{
        try{
            const conn = await ConnectionPool.getConnection();
            try{
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
                conn.release();
                res.status(200).send({...userData[0], book_favor: bookFavorData});
            }catch(err){
                conn.release();
                console.log('8-1-1. 유저 정보 조회 중 에러 발생');
                console.log(err);
                req.status(404).send({success: false, reason: err});
            }
        }catch(err){
            console.log('8-1-1. DB 연결 에러');
            console.log(err);
            req.status(404).send({success: false, reason: err});
        }
    }
});

module.exports = router;