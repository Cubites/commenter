const router = require('express').Router();

const ConnectionPool = require('../modules/ConnectionPool');
const { accessToken, refressToken } = require('../modules/jwt');

// 0. 로그인된 상태인지 확인
router.post('/user/login', (req, res, next) => {
    console.log('1-0. 로그인된 상태인지 확인');
    if(req.body.signInSkip){
        console.log('1-0-1. 로그인된 상태. 로그인 절차 생략');
        console.log('req.signedCookies.auth.access_token : ', req.signedCookies.auth.access_token);
        res.status(200).send({user_id: req.signedCookies.auth.user_id});
    }else{
        console.log('1-0-1. 로그인된 상태가 아님. 로그인 절차 진행');
        next();
    }
})

// 1. 신규 유저인지 기존 유저인지 판별
router.post('/user/login', async (req, res, next) => {
    console.log('\n1-1. 신규 유저인지 기존 유저인지 판별');
    console.log('req.body : ', req.body);
    try{
        const conn = await ConnectionPool.getConnection();
        try{
            let userInfo = await conn.query(`
                select user_id, ${req.body.login_method}_token as token from user_info 
                    where ${req.body.login_method}_token = '${req.body.user_code}';`);
            if(userInfo.length !== 0){
                console.log('1-1-1. 기존 유저임을 확인');
                req.body.user_id = userInfo[0].user_id;
                req.body.isNewBie = false;
            }else{
                console.log('1-1-1. 신규 유저임을 확인');
                req.body.user_id = 0;
                req.body.isNewBie = true;
            }
            next();
        }catch(err){
            console.log('1-1-1. 유저 정보 조회 에러');
            console.log(err);
            res.clearCookie('auth');
            res.status(404).send({user_id: null, isLogout: true, login_success: false});
        }
        conn.release();
    }catch(err){
        console.log('1-1-1. DB 연결 에러');
        res.clearCookie('auth');
        res.status(404).send({user_id: null, isLogout: true, login_success: false});
        console.log(err);
    }
});

// 2. 신규 유저인 경우, 회원가입 시행. 기존 유저는 생략
router.post('/user/login', async (req, res, next) => {
    console.log('1-2. 회원가입 필요성 검사');
    console.log('req.body.isNewBie : ', req.body.isNewBie);
    if(req.body.isNewBie){
        console.log('1-2-2. 신규 유저로 판단, 회원가입 시작');
        try{
            const conn = await ConnectionPool.getConnection();
            try{
                const userCount = await conn.query(`select user_id as last_ui from user_info order by user_id desc limit 1;`);
                let newUserId = `UI${('0000000000' + (Number((userCount[0].last_ui).slice(-10)) + 1)).slice(-10)}`;
                console.log('1-2-3. 신규 유저 아이디 생성 완료 : ', newUserId);
                try{
                    const signUpResult = await conn.query(`
                        insert user_info (user_id, nickname, ${req.body.login_method}_token)
                            values ('${newUserId}', '${(Math.round(Math.random() * 10000000))}', '${req.body.user_code}');`);
                    console.log('1-2-4. 신규 유저 정보 저장 완료');
                    console.log('signUpResult : ', signUpResult);
                    req.body.user_id = newUserId;
                    next();
                }catch(err){
                    console.log('1-2-4. 신규 유저 정보 저장 중 에러 발생. 회원가입 중지');
                    res.status(404).send({user_id: null, isLogout: true});
                }
            }catch(err){
                console.log('1-2-3. 신규 유저 아이디 생성 중 에러 발생. 회원가입 중지');
                console.log(err);
                res.status(404).send({user_id: null, isLogout: true});
            }
            conn.release();
        }catch(err){
            console.log('1-2-3. DB 연결 에러');
            console.log(err);
        }
    }else{
        console.log('1-2-2. 기존 유저는 회원가입 절차 생략');
        next();
    }
});

// 3. Access Token, Refresh Token 발급
router.post('/user/login', async (req, res, next) => {
    console.log('1-3. 토큰 발급');
    console.log('req.body.user_id : ', req.body.user_id);
    if(req.body.user_id !== null){
        console.log('1-3-1. 유저 조회에 성공(user_id가 있음). 토큰 발급');
        let access_token = accessToken(req.body.user_id, process.env.JWT_SECRET_KEY);
        let refresh_token = refressToken(req.body.user_id, access_token, process.env.JWT_SECRET_KEY);
        try{
            const conn = await ConnectionPool.getConnection();
            try{
                console.log('1-3-2. 로그인 토큰 정보가 존재하는지 확인');
                const tokenCheck = await conn.query(`select * from login_token where user_id = '${req.body.user_id}'`);
                console.log('tokenCheck : ', tokenCheck);
                if(tokenCheck.length !== 0){
                    console.log('1-3-3. 기존 로그인 정보가 존재. 저장된 토큰 삭제 후, 토큰 저장');
                    await conn.query(`delete from login_token where user_id = '${req.body.user_id}'`);
                    req.body.access_token = null;
                }
                const tokenSaveResult = await conn.query(
                    `insert login_token (user_id, access_token, refresh_token, refresh_expire) values (?, ?, ?, ?);`, 
                    [req.body.user_id, access_token, refresh_token.refressToken, refresh_token.expire]);
                console.log('1-3-4. 토큰 저장 성공');
                console.log('tokenSaveResult : ', tokenSaveResult)
                req.body.access_token = access_token;
                next();
            }catch(err){
                console.log('1-3-2. 토큰 저장 실패, 재 로그인 권장');
                console.log(err);
                req.body.access_token = null;
                next();
            }
            conn.release();
        }catch(err){
            console.log('1-3-2. DB 연결 에러');
            console.log(err);
            next();
        }
    }else{
        console.log('1-3-1. 유저 조회에 실패(user_id 값이 없음). 토큰 발급 생략');
        req.body.access_token = null;
        next();
    }
});

module.exports = router;