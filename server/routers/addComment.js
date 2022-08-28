const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

// 3. 코멘트 추가
router.post('/comment/info', async (req, res, next) => {
    if(req.body.ip === null){
        try{
            console.log('3-1. 코멘트 추가');
            const conn = await ConnectionPool.getConnection();
            const commentCount = await conn.query(`select Max(comment_id) as last_comment_id from comment;`);
            let newCommentId = commentCount[0].last_comment_id + 1;
            // await conn.query(`insert comment (comment_id, user_id, content, )`);
            conn.release();
        }catch(err){
            console.log('3-1-1. 코멘트 추가 에러');
            console.log(err);
        }
    }
    res.status(200).send('/comment/info');
});

module.exports = router;