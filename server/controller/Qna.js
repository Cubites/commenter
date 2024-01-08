const ConnectionPool = require('../modules/ConnectionPool');
const nowTime = require('../modules/nowTime');

let Qna = {};

Qna.insert = async (req, res, next) => {
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
            conn.release();
            res.status(200).send({success: true, reason: null});
        }catch(err){
            conn.release();
            console.log('10-1-1. 문의 내용 업로드 중 에러 발생');
            console.log(err);
            res.status(404).send({success: false, reason: err});
        }        
    }catch(err){
        console.log('10-1-1. DB 연결 에러');
        console.log(err);
        res.status(500).send({success: false, reason: 'err'});
    }
}

Qna.info = async (req, res, next) => {
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
}

Qna.search = async (req, res, next) => {
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
}

module.exports = Qna;