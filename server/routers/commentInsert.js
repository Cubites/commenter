const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');
const nowTime = require('../modules/nowTime');

// 3. 코멘트 추가
router.post('/comment/insert', async (req, res, next) => {
    if(req.body.user_id !== null){
        try{
            console.log('3-1. 코멘트 추가');
            const conn = await ConnectionPool.getConnection();
            const commentCount = await conn.query(`select Max(comment_id) as last_comment_id from comment;`);
            let newCommentId = commentCount[0].last_comment_id + 1;
            await conn.query(`
                insert comment (comment_id, user_id, isbn, comment_content, comment_date) 
                    values (${newCommentId}, ${req.body.user_id}, '${req.body.isbn}', '${req.body.content}', DATE_FORMAT('${nowTime()}', '%Y-%m-%d %H:%i:%s'));
            `);
            conn.release();
            res.status(200).send({success: true, reason: null});
        }catch(err){
            console.log('3-1-1. 코멘트 추가 에러');
            console.log(err);
            conn.release();
            res.status(404).send({success: false, reason: err});
        }
    }else{
        res.status(200).send('비회원 코멘트 추가');
    }
});

module.exports = router;