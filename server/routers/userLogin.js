const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');
const { accessToken, refressToken } = require('../modules/jwt');

// 0. 로그인된 상태인지 확인
// router.post('/user/login', (req, res, next) => {
//     console.log('1-0. 로그인된 상태인지 확인');
//     if(req.body.signInSkip){
//         console.log('1-0-1. 로그인된 상태. 로그인 절차 생략');
//         console.log('req.signedCookies.auth.access_token : ', req.signedCookies.auth.access_token);
//         res.status(200).send({user_id: req.signedCookies.auth.user_id});
//     }else{
//         console.log('1-0-1. 로그인된 상태가 아님. 로그인 절차 진행');
//         next();
//     }
// })

// 1. 신규 유저인지 기존 유저인지 판별
router.post('/user/login', async (req, res, next) => {
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
});

// isNewBie : 신규유저 판별 (true = 신규유저, false = 기존유저)

// 2. 신규 유저인 경우, 회원가입 시행. 기존 유저는 생략
router.post('/user/login', async (req, res, next) => {
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
});

// 3. Access Token, Refresh Token 발급
router.post('/user/login', async (req, res, next) => {
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
});

module.exports = router;