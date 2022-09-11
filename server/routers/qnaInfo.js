const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/qna/info', async (req, res, next) => {
    console.log('12-1. 문의 상세내용 조회');
    if(req.body.user_id === null || req.body.user_id === undefined){
        res.send(404).send('12-1-1. 잘못된 접근입니다.');
    }
    try{
        const conn = await ConnectionPool.getConnection();
        try{
            const qnaDetailData = await conn.query(`
                SELECT qna_date, qna_reason, qna_content, answer FROM qna WHERE qna_id = '${req.body.qna_id}' AND user_id = '${req.body.user_id}';
            `);
            conn.release();
            res.status(200).send(qnaDetailData);            
        }catch(err){
            conn.release();
            console.log('12-1-2. 문의 상세내용 조회 중 에러 발생');
            res.status(404).send({success: false, reason: err});
        }
    }catch(err){
        console.log('12-1-2. DB 연결 에러');
        console.log(err);
        res.status(500).send({success: false, reason: err});
    }
});

module.exports = router;