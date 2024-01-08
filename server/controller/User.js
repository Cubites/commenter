const ConnectionPool = require('../modules/ConnectionPool');
const { accessToken, refressToken } = require('../modules/jwt');

let User = {};

User.check = async (req, res, next) => {
    console.log('\n1-1. 신규 유저인지 기존 유저인지 판별');
    console.log('req.body : ', req.body);
    try{
        const conn = await ConnectionPool.getConnection();
        try{
            let userInfo = await conn.query(`
                SELECT user_id, ${req.body.login_method}_token AS token FROM user_info 
                WHERE ${req.body.login_method}_token = '${req.body.user_code}';`);
            if(userInfo.length !== 0){
                console.log('1-1-1. 기존 유저임을 확인');
                req.body.user_id = userInfo[0].user_id;
                req.body.isNewBie = false;
            }else{
                console.log('1-1-1. 신규 유저임을 확인');
                req.body.user_id = 0;
                req.body.isNewBie = true;
            }
            conn.release();
            next();
        }catch(err){
            conn.release();
            console.log('1-1-1. 유저 정보 조회 에러');
            console.log(err);
            res.clearCookie('auth');
            res.status(404).send({user_id: null, login_success: false, isLogout: true});
        }
    }catch(err){
        console.log('1-1-1. DB 연결 에러');
        console.log(err);
        res.clearCookie('auth');
        res.status(404).send({user_id: null, login_success: false, isLogout: true});
    }
}

User.register = async (req, res, next) => {
    console.log('1-2. 회원가입 필요성 검사');
    console.log('req.body.isNewBie : ', req.body.isNewBie);
    if(req.body.isNewBie){ // 신규유저. 회원가입 진행
        console.log('1-2-2. 신규 유저로 판단, 회원가입 시작');
        try{
            const conn = await ConnectionPool.getConnection();
            try{
                const userCount = await conn.query(`SELECT user_id AS last_ui FROM user_info ORDER BY user_id DESC LIMIT 1;`);
                let newUserId = `UI${('0000000000' + (Number((userCount[0].last_ui).slice(-10)) + 1)).slice(-10)}`;
                console.log('1-2-3. 신규 유저 아이디 생성 완료 : ', newUserId);

                await conn.query(`
                    INSERT user_info (user_id, nickname, ${req.body.login_method}_token)
                    VALUES ('${newUserId}', '${'NK' + newUserId.slice(-10)}', '${req.body.user_code}');`);
                console.log('1-2-4. 신규 유저 정보 저장 완료');
                req.body.user_id = newUserId;
                conn.release();
                next();
            }catch(err){
                conn.release();
                console.log('1-2-5. 신규 유저 아이디 생성 및 저장 중 에러 발생. 회원가입 중지');
                console.log(err);
                res.status(404).send({user_id: null, isLogout: true});
            }
        }catch(err){
            console.log('1-2-3. DB 연결 에러');
            console.log(err);
            res.status(404).send({user_id: null, isLogout: true});
        }
    }else{ // 기존유저. 회원가입 생략
        console.log('1-2-2. 기존 유저는 회원가입 절차 생략');
        next();
    }
}

User.token = async (req, res, next) => {
    console.log('1-3. 토큰 발급');
    if(req.body.user_id !== null){
        console.log('1-3-1. 유저 조회에 성공(user_id가 있음). 토큰 발급');
        let access_token = accessToken(req.body.user_id, process.env.JWT_SECRET_KEY);
        let refresh_token = refressToken(req.body.user_id, access_token, process.env.JWT_SECRET_KEY);
        try{
            const conn = await ConnectionPool.getConnection();
            try{
                console.log('1-3-2. 로그인 토큰 정보가 존재하는지 확인');
                const tokenCheck = await conn.query(`SELECT * FROM login_token WHERE user_id = '${req.body.user_id}' LIMIT 1;`);
                console.log('tokenCheck : ', tokenCheck[0]);
                if(tokenCheck.length !== 0){ // 로그인 토큰이 이미 존재함. 삭제 후, 재등록 진행
                    console.log('1-3-3. 기존 로그인 정보가 존재. 저장된 토큰 삭제 후, 토큰 저장');
                    await conn.query(`DELETE FROM login_token WHERE user_id = '${req.body.user_id}';`);
                    req.body.access_token = null;
                }
                await conn.query(
                    `INSERT login_token (user_id, access_token, refresh_token, refresh_expire) VALUES (?, ?, ?, ?);`, 
                    [req.body.user_id, access_token, refresh_token.refressToken, refresh_token.expire]);
                console.log('1-3-4. 토큰 저장 성공');
                req.body.access_token = access_token;
                conn.release();
                res.clearCookie('auth');
                res.cookie('auth', {user_id: req.body.user_id, access_token: req.body.access_token}, {httpOnly: true, signed: true})
                    .status(200).send({loginSuccess: true, isLogout: req.body.isLogout});
            }catch(err){
                conn.release();
                console.log('1-3-2. 토큰 저장 실패, 재 로그인 권장');
                console.log(err);
                res.status(404).send({success: false, reason: '로그인 토큰 저장 실패'});
            }
        }catch(err){
            console.log('1-3-2. DB 연결 에러');
            console.log(err);
            res.status(404).send({success: false, reason: 'DB 연결 에러. 로그인 토큰 저장 실패'});
        }
    }else{
        console.log('1-3-1. 유저 조회에 실패(user_id 값이 없음). 토큰 발급 생략');
        res.status(404).send({success: false, reason: '유저 조회 실패'});
        console.log(err);
    }
}

User.update = async (req, res, next) => {
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
}

User.info = async (req, res, next) => {
    console.log('8-1. 마이 페이지 조회');
    if(req.body.user_id === null){
        console.log('8-1-1. 로그인 상태가 아님. 에러 출력');
        res.status(404).send({success: false, reason: '잘못된 접근입니다.'});
    }else{
        try{
            const conn = await ConnectionPool.getConnection();
            try{
                const userData = await conn.query(`
                    SELECT 
                        ui.user_id
                        , ui.nickname
                        , ui.intro
                        , count(distinct cm.comment_id) comment_cnt
                        , sum(cf.is_comment_favor) favor_cnt
                    from user_info ui
                        inner join comment cm 
                        on ui.user_id = cm.user_id
                        inner join comment_favor cf
                        on cm.comment_id = cf.comment_id
                    where ui.user_id = '${req.body.user_id}';
                `);
                const bookFavorData = await conn.query(`
                    SELECT 
                        bk.isbn
                        , bk.book_title 
                        , bk.image_url 
                    FROM book_favor bf
                        INNER JOIN book bk 
                        ON bf.isbn = bk.isbn 
                    where bf.user_id = '${req.body.user_id}';
                `);
                conn.release();
                res.status(200).send({...userData[0], book_favor: bookFavorData});
            }catch(err){
                conn.release();
                console.log('8-1-1. 유저 정보 조회 중 에러 발생');
                console.log(err);
                req.status(404).send({success: false, reason: err});
            }
        }catch(err){
            console.log('8-1-1. DB 연결 에러');
            console.log(err);
            req.status(404).send({success: false, reason: err});
        }
    }
}

module.exports = User;