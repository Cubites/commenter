const router = require('express').Router();

const res = require('express/lib/response');
const ConnectionPool = require('../modules/ConnectionPool');

router.post('/comment/delete', async (req, res, next) => {
    console.log('6-1. 코멘트 삭제 절차 진행');
    try{
        const conn = await ConnectionPool.getConnection();
        if(req.body.user_id === undefined || req.body.user_id === null){
            console.log('6-1-1. 권한이 없는 사용자가 코멘트 삭제 시도');
            res.status(404).send({success: false, reason: '코멘트 삭제 권한이 없습니다. 로그인 후 이용해주세요.'});
        }else{
            const commentData = await conn.query(`SELECT user_id FROM comment WHERE comment_id = '${req.body.comment_id}'`)
            if(commentData.length === 0){
                res.status(404).send({success: false, reason: "이미 삭제된 코멘트입니다."});
            }else if(commentData[0].user_id !== req.body.user_id){
                console.log('6-1-1. 코멘트 작성자가 아닌 사람이 삭제 시도');
                res.status(404).send({success: false, reason: '코멘트 삭제 권한이 없습니다. 본인이 작성한 코멘트만 삭제할 수 있습니다.'});
            }else{
                await conn.query(`
                    DELETE FROM comment where comment_id = '${req.body.comment_id}' AND user_id = '${req.body.user_id}';
                `);
                res.status(200).send({success: true, reason: null});
            }
        }
    }catch(err){
        console.log('6-1-1. 코멘트 삭제 중 에러 발생');
        console.log(err);
        res.status(404).send({success: false, reason: '삭제중 에러 발생'});
    }
});

module.exports = router;