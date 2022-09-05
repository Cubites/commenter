const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');
const nowTime = require('../modules/nowTime');

router.post('/qna/insert', async (req, res, next) => {
    console.log('10-1. 문의 접수');
    console.log('req.body : ', req.body);
    try{
        const conn = await ConnectionPool.getConnection();
        try{
            console.log('10-1-1. 문의 내용 저장');
            const qnaLatestId = await conn.query(`SELECT qna_id FROM qna ORDER BY qna_id DESC LIMIT 1;`);
            await conn.query(`
                insert qna (qna_id, user_id, qna_reason, qna_content, qna_date) 
                values ('QN${('0000000000' + (Number(qnaLatestId[0].qna_id.slice(-10))+1)).slice(-10)}', '${req.body.user_id}', '${req.body.qna_reason}', '${req.body.qna_content}', DATE_FORMAT('${nowTime()}', '%Y-%m-%d %H:%i:%s'));
            `);
            res.status(200).send({success: true, reason: null});
        }catch(err){
            console.log('10-1-1. 문의 내용 업로드 중 에러');
            console.log(err);
            res.status(404).send({success: false, reason: '문의 내용 업로드 에러'});
        }        
    }catch(err){
        console.log('10-1-1. 문의 접수 중 DB 연결 에러');
        console.log(err);
        res.status(404).send({success: false, reason: 'DB 연결 에러'})
    }
});

module.exports = router;