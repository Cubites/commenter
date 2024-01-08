const ConnectionPool = require('../modules/ConnectionPool');
const nowTime = require('../modules/nowTime');

let Comment = {};

Comment.insert = async (req, res, next) => {
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
}

Comment.delete = async (req, res, next) => {
    console.log('6-1. 코멘트 삭제 절차 진행');
    try{
        const conn = await ConnectionPool.getConnection();
        try{
            if(req.body.user_id === undefined || req.body.user_id === null){
                console.log('6-1-1. 권한이 없는 사용자가 코멘트 삭제 시도');
                res.status(404).send({success: false, reason: '코멘트 삭제 권한이 없습니다. 로그인 후 이용해주세요.'});
            }else{
                const commentData = await conn.query(`SELECT user_id FROM comment WHERE comment_id = '${req.body.comment_id}'`)
                if(commentData.length === 0){
                    console.log('6-1-1. 이미 삭제된 코멘트');
                    res.status(404).send({success: false, reason: "이미 삭제된 코멘트입니다."});
                }else if(commentData[0].user_id !== req.body.user_id){
                    console.log('6-1-1. 코멘트 작성자가 아닌 사람이 삭제 시도');
                    res.status(404).send({success: false, reason: '코멘트 삭제 권한이 없습니다. 본인이 작성한 코멘트만 삭제할 수 있습니다.'});
                }else{
                    console.log('6-1-1. 코멘트 작성자가 정상적으로 코멘트 삭제 시도');
                    await conn.query(`
                        DELETE FROM comment where comment_id = '${req.body.comment_id}' AND user_id = '${req.body.user_id}';
                    `);
                    console.log('6-1-2. 코멘트 삭제 성공');
                    res.status(200).send({success: true, reason: null});
                }
            }
            conn.release();
        }catch(err){
            conn.release();
            console.log('6-1-1. 코멘트 삭제 중 에러 발생');
            console.log(err);
            res.status(404).send({success: false, reason: '코멘트 삭제중 에러 발생'});
        }
    }catch(err){
        console.log('6-1-1. DB 연결 에러');
        console.log(err);
        res.status(404).send({success: false, reason: err});
    }
}

Comment.info = async (req, res, next) => {
    console.log('4-1. 코멘트 데이터 요청');
    try{
        const conn = await ConnectionPool.getConnection();
        try{
            // 책 페이지에서 요청인지 마이페이지에서 요청인지 구분
            if(req.body.sort !== null){
                console.log('4-1-1. 책 페이지에서의 요청. 해당 책에 작성된 코멘트 조회');
                // * 로그인 상태인 경우 - 코멘트에 대한 좋아요 정보 요청
                // * 로그인 상태가 아닌 경우 - 코멘트에 대한 좋아요 정보 요청 X
                const commentData = await conn.query(`
                    SELECT 
                        comment_id AS cm_id
                        , comment_content AS cm_content
                        , comment_date AS cm_date
                        , (
                            SELECT ui.nickname
                            FROM user_info ui 
                            WHERE cm.user_id = ui.user_id 
                        ) AS nickname
                        , (
                            SELECT COUNT(cf.comment_id)
                            FROM comment_favor cf
                            WHERE cf.comment_id = cm.comment_id 
                        ) AS cm_like_num
                        ${
                            req.body.user_id !== null ?
                            `
                                , (
                                    SELECT cf2.is_comment_favor 
                                    FROM comment_favor cf2
                                    WHERE cf2.comment_id = cm.comment_id AND cf2.user_id = '${req.body.user_id}' 
                                ) AS is_cm_favor
                                , (
                                    SELECT 1
                                    FROM comment cm2
                                    WHERE cm2.user_id = '${req.body.user_id}' AND cm.comment_id = cm2.comment_id 
                                ) AS is_writer
                            ` : 
                            ``
                        }
                        , (
                            SELECT 1
                            FROM report rp
                            WHERE cm.comment_id = rp.comment_id
                        ) AS is_reported
                    FROM comment cm
                    WHERE isbn = '${req.body.isbn}'
                    ORDER BY ${req.body.sort === 0 ? `cm.comment_date` : `cm_like_num`} DESC
                    LIMIT ${Number(req.body.item_size) * (Number(req.body.page_num) - 1)}, ${Number(req.body.item_size)};
                `);
                res.status(200).send(commentData);
            }else{
                console.log('4-1-1. 마이 페이지에서의 요청. 해당 유저가 작성한 코멘트 조회');
                if(req.body.user_id === null){
                    console.log('4-1-2. 로그인 상태가 아님. 에러 출력');
                    res.status(404).send({success: false, reason: '잘못된 접근입니다.'});
                }
                const commentData = await conn.query(`
                SELECT 
                    cm.cm_id
                    , cm.isbn
                    , cm.cm_date 
                    , bk.image_url 
                FROM comment cm
                    LEFT JOIN book bk 
                    ON cm.isbn = bk.isbn
                WHERE user_id = '${req.body.user_id}';
                `);
                res.status(200).send(commentData);
            }
            conn.release();
        }catch(err){
            conn.release();
            console.log('4-1-2. 코멘트 조회 중 에러 발생');
            console.log(err);
            res.status(404).send({success: false, err: err});
        }
    }catch(err){
        console.log('4-1-1. DB 연결 에러');
        console.log(err);
        res.status(404).send({success: false, err: err});
    }   
}

Comment.report = async (req, res, next) => {
    console.log('5-1. 코멘트 신고 절차 진행');
    if(req.body.user_id === undefined || req.body.user_id === null){
        console.log('5-1-1. 로그인하지 않은 유저. 신고 기능 제한');
        res.status(404).send({success: false, reason: '신고 권한이 없습니다. 신고는 로그인해야 할 수 있습니다.'});
    }else{
        try{
            const conn = await ConnectionPool.getConnection();
            try{
                const now = nowTime();
                await conn.query(`
                    INSERT report (comment_id, user_id, report_reason, report_date)
                    VALUES ('${req.body.comment_id}', '${req.body.user_id}', '${req.body.report_reason}', '${now}');
                `);
                conn.release();
                res.status(200).send({success: true, reason: null});
            }catch(err){
                conn.release();
                console.log('5-1-1. 코멘트 신고 처리 중 에러');
                res.status(404).send({success: false, reason: err});
            }
        }catch(err){
            console.log('5-1-1. DB 연결 에러');
            res.status(500).send({success: false, reason: err});
        }
    }
}

module.exports = Comment;