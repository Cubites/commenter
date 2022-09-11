const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/qna/search', async (req, res, next) => {
    console.log('11-1. 문의 내역 조회');
    if(req.body.user_id === null){
        console.log('11-1-1. 로그인 상태가 아님. 에러 출력');
        res.status(404).send({success: false, reason: '잘못된 접근입니다.'});
    }
    try{
        const conn = await ConnectionPool.getConnection();
        try{
            const qnaData = await conn.query(`
                SELECT qna_id, qna_reason, qna_content, qna_date, answer FROM qna WHERE user_id = '${req.body.user_id}';
            `);
            conn.release();
            res.status(200).send(qnaData);
        }catch(err){
            conn.release();
            console.log('11-1-1. QnA 데이터 요청 중 에러 발생');
            res.status(404).send({success: false, reason: err});
        }
    }catch(err){
        console.log('11-1-1. DB 연결 에러');
        res.status(500).send({success: false, reason: err});
    }
});

module.exports = router;