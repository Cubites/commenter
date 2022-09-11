const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');

router.post('/user/update', async (req, res, next) => {
    console.log('9-1. 유저 정보 수정');
    if(req.body.user_id === null){
        console.log('9-1-1. 로그인 상태가 아님. 에러 출력');
        res.status(404).send({success: false, reason: '잘못된 접근입니다.'});
    }else{
        try{
            const conn = await ConnectionPool.getConnection();
            try{
                await conn.query(`
                    UPDATE user_info SET nickname = '${req.body.user_nick}', intro = '${req.body.user_profile}' WHERE user_id = '${req.body.user_id}'
                `);
                conn.release();
                res.status(200).send({success: true, reason: null});
            }catch(err){
                conn.release();
                console.log('9-1-1. 유저정보 수정 중 에러 발생');
                console.log(err);
                res.status(404).send({success: false, reason: err});
            }
        }catch(err){
            console.log('9-1-1. DB 연결 에러');
            console.log(err);
            res.status(404).send({success: false, reason: err});
        }
    }
});

module.exports = router;