const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');
const nowTime = require('../modules/nowTime');

// 3. 코멘트 추가
router.post('/comment/insert', async (req, res, next) => {
    console.log('3-1. 코멘트 추가');
    try{
        const conn = await ConnectionPool.getConnection();
        try{
            const commentCount = await conn.query(`
                SELECT comment_id AS last_comment_id FROM comment
                ORDER BY comment_id DESC limit 1;
            `);
            let newCommentId = `CM${('0000000000' + (Number(commentCount[0].last_comment_id.slice(-10))+1)).slice(-10)}`;
            
            if(req.body.user_id !== undefined){
                console.log('3-1-1. 회원 코멘트 작성');
                await conn.query(`
                    insert comment (comment_id, user_id, isbn, comment_content, comment_date) 
                        values ('${newCommentId}', '${req.body.user_id}', '${req.body.isbn}', '${req.body.content}', DATE_FORMAT('${nowTime()}', '%Y-%m-%d %H:%i:%s'));
                `);
                res.status(200).send({success: true, reason: null});
            }else{
                console.log('3-1-1. 비회원 코멘트 작성');
                const isWriteBefore = await conn.query(`SELECT guest_ip, comment_count FROM guest WHERE guest_ip = '${req.body.ip}'`);
                if(isWriteBefore.length === 0 || isWriteBefore[0].comment_count !== 3){
                    if(isWriteBefore.length === 0){
                        await conn.query(`INSERT guest (guest_ip, comment_count) VALUES ('${req.body.ip}', 1)`);
                    }else{
                        await conn.query(`
                            UPDATE guest SET comment_count = ${isWriteBefore[0].comment_count + 1} 
                            WHERE guest_ip = '${req.body.ip}';`)
                    }
                    await conn.query(`
                        insert comment (comment_id, guest_ip, isbn, comment_content, comment_date) 
                            values ('${newCommentId}', '${req.body.ip}', '${req.body.isbn}', '${req.body.content}', DATE_FORMAT('${nowTime()}', '%Y-%m-%d %H:%i:%s'));
                    `);
                    res.status(200).send({success: true, reason: null});
                }else if(isWriteBefore[0].comment_count === 3){
                    res.status(200).send({success: false, reason: '일일 작성 갯수를 초과하였습니다. 비회원은 하루에 3개까지 작성할 수 있습니다.'});
                }
            }
            conn.release();
        }catch(err){
            conn.release();
            console.log('3-1-2. 코멘트 추가 중 에러 발생');
            console.log(err);
            res.status(404).send({success: false, reason: err});
        }
    }catch(err){
        console.log('3-1-2. DB 연결 에러');
        console.log(err);
        res.status(500).send({success: false, reason: err});
    }
});

module.exports = router;