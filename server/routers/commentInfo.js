const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/comment/info', async (req, res, next) => {
    console.log('4-1. 코멘트 데이터 요청');
    try{
        const conn = await ConnectionPool.getConnection();
        try{
            // 책 페이지에서 요청인지 마이페이지에서 요청인지 구분
            if(req.body.sort !== null){
                console.log('4-1-1. 책 페이지에서의 요청. 해당 책에 작성된 코멘트 조회');
                // * 로그인 상태인 경우 - 코멘트에 대한 좋아요 정보 요청
                // * 로그인 상태가 아닌 경우 - 코멘트에 대한 좋아요 정보 요청 X
                const commentData = await conn.query(`
                    SELECT 
                        comment_id AS cm_id
                        , comment_content AS cm_content
                        , comment_date AS cm_date
                        , (
                            SELECT ui.nickname
                            FROM user_info ui 
                            WHERE cm.user_id = ui.user_id 
                        ) AS nickname
                        , (
                            SELECT COUNT(cf.comment_id)
                            FROM comment_favor cf
                            WHERE cf.comment_id = cm.comment_id 
                        ) AS cm_like_num
                        ${
                            req.body.user_id !== null ?
                            `
                                , (
                                    SELECT cf2.is_comment_favor 
                                    FROM comment_favor cf2
                                    WHERE cf2.comment_id = cm.comment_id AND cf2.user_id = '${req.body.user_id}' 
                                ) AS is_cm_favor
                                , (
                                    SELECT 1
                                    FROM comment cm2
                                    WHERE cm2.user_id = '${req.body.user_id}' AND cm.comment_id = cm2.comment_id 
                                ) AS is_writer
                            ` : 
                            ``
                        }
                        , (
                            SELECT 1
                            FROM report rp
                            WHERE cm.comment_id = rp.comment_id
                        ) AS is_reported
                    FROM comment cm
                    WHERE isbn = '${req.body.isbn}'
                    ORDER BY ${req.body.sort === 0 ? `cm.comment_date` : `cm_like_num`} DESC
                    LIMIT ${Number(req.body.item_size) * (Number(req.body.page_num) - 1)}, ${Number(req.body.item_size)};
                `);
                res.status(200).send(commentData);
            }else{
                console.log('4-1-1. 마이 페이지에서의 요청. 해당 유저가 작성한 코멘트 조회');
                if(req.body.user_id === null){
                    console.log('4-1-2. 로그인 상태가 아님. 에러 출력');
                    res.status(404).send({success: false, reason: '잘못된 접근입니다.'});
                }
                const commentData = await conn.query(`
                SELECT 
                    cm.cm_id
                    , cm.isbn
                    , cm.cm_date 
                    , bk.image_url 
                FROM comment cm
                    LEFT JOIN book bk 
                    ON cm.isbn = bk.isbn
                WHERE user_id = '${req.body.user_id}';
                `);
                res.status(200).send(commentData);
            }
            conn.release();
        }catch(err){
            conn.release();
            console.log('4-1-2. 코멘트 조회 중 에러 발생');
            console.log(err);
            res.status(404).send({success: false, err: err});
        }
    }catch(err){
        console.log('4-1-1. DB 연결 에러');
        console.log(err);
        res.status(404).send({success: false, err: err});
    }
    
});

module.exports = router;