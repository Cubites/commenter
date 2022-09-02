const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');
const nowTime = require('../modules/nowTime');

router.post('/comment/report', async (req, res, next) => {
    console.log('5-1. 코멘트 신고 절차 진행');
    if(req.body.user_id === undefined || req.body.user_id === null){
        console.log('5-1-1. 로그인하지 않은 유저. 신고 기능 제한');
        res.status(404).send({success: false, reason: '신고 권한이 없습니다. 신고는 로그인해야 할 수 있습니다.'});
    }else{
        const conn = await ConnectionPool.getConnection();
        const now = nowTime();
        await conn.query(`
            INSERT report (comment_id, user_id, report_reason, report_date)
            VALUES ('${req.body.comment_id}', '${req.body.user_id}', '${req.body.report_reason}', '${now}');
        `);
        res.status(200).send({success: true, reason: null});
    }
});

module.exports = router;