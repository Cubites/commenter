const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/qna/info', async (req, res, next) => {
    console.log('12-1. 문의 상세내용 조회');
    if(req.body.user_id === null || req.body.user_id === undefined){
        res.send(404).send('12-1-1. 잘못된 접근입니다.');
    }
    try{
        const conn = await ConnectionPool.getConnection();
        const qnaDetailData = await conn.query(`
            SELECT qna_date, qna_reason, qna_content, answer FROM qna WHERE qna_id = '${req.body.qna_id}' AND user_id = '${req.body.user_id}';
        `);
        res.status(200).send(qnaDetailData);
    }catch(err){
        console.log('12-1-2. 문의 상세내용 조회 중 에러 발생');
        console.log(err);
    }
});

module.exports = router;