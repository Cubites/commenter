const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const ConnectionPool = require('../modules/ConnectionPool');
const { accessToken } = require('../modules/jwt');

/* 
    * 쿠키가 있는 경우
        * access token이 있는 경우
            * access token이 유효한 경우
            * access token이 만료된 경우
        * access token이 없는 경우
    * 쿠키가 없는 경우
*/

// 1. 쿠키 존재 확인
router.all('*', (req, res, next) => {
    console.log('\n0-1. 쿠키 유무 확인 단계');
    console.log('req.body : ', req.body);
    console.log('req.signedCookies.auth : ', req.signedCookies.auth);
    if(req.signedCookies.auth !== undefined){ // Access token이 존재.
        console.log('0-1-1. 쿠키 존재. Access Token 존재 확인');
        if(req.signedCookies.auth.access_token === null){
            console.log('0-1-2. Access Token이 존재하지 않음');
            req.body.needToCheckAccessToken = false;
            req.body.needToClearCookie = true;
            req.body.needToClearRefreshToken = true;
            req.body.isLogout = true;
            next();
        }else{
            console.log('0-1-2. Access Token 존재');
            req.body.needToCheckAccessToken = true;
            req.body.needToClearCookie = false;
            req.body.needToClearRefreshToken = false;
            req.body.isLogout = false;
            next();
        }
    }else{
        console.log('0-1-1. 쿠키 없음');
        req.body.needToCheckAccessToken = false;
        req.body.needToClearCookie = true;
        req.body.needToClearRefreshToken = false;
        req.body.isLogout = true;
        next();
    }
});

// needToCheckAccessToken : Access Token 유효성 검사 필요 여부 (true = 필요, false = 불필요)
// needToClearCookie : 쿠키 삭제 필요 여부 (true = 필요, false = 불필요)
// needToClearRefreshToken : Refresh Token 삭제 필요 여부 (true = 필요, false = 불필요)
// isLogout : Logout 처리 여부 (true = 필요, false = 불필요)

// 2. Access Token 유효성 검사
router.all('*', (req, res, next) => {
    console.log('\n0-2. Access Token 유효성 검사 단계');
    console.log('req.body.needToCheckAccessToken : ', req.body.needToCheckAccessToken);
    if(req.body.needToCheckAccessToken){ // Access Token 유효성 검사 필요
        console.log('0-2-1. Access Token 유효성 검사 필요');
        jwt.verify(req.signedCookies.auth.access_token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            console.log('0-2-2. Access Token 유효성 검사 결과 : ', decoded);
            if(err){
                if(err.message == 'jwt expired'){ // Access Token 만료. refreshToken 체크
                    console.log('0-2-3. Access Token 유효기간 만료.');
                    req.body.needToReissueAccessToken = true;
                }else if(err.message == 'invalid token'){ // 잘못된 Access Token으로 접속 시도. 부정 사용자로 간주하고 로그아웃처리
                    console.log('0-2-3. 잘못된 토큰 : ' + err);
                    req.body.needToReissueAccessToken = false;
                    req.body.needToClearCookie = true;
                    req.body.needToClearRefreshToken = true;
                    req.body.isLogout = true;
                }else{ // Access Token 유효성 검사 중 에러. 상황판단 불가로 일단 로그아웃 처리
                    console.log('0-2-3. Access Token 유효성 확인 error : ' + err);
                    req.body.needToReissueAccessToken = false;
                    req.body.needToClearCookie = true;
                    req.body.needToClearRefreshToken = true;
                    req.body.isLogout = true;
                }
            }else{ // 유효한 Access Token. 로그인 유지
                console.log('0-2-3. 유효한 Access Token. 로그인 생태를 유지.');
                req.body.needToReissueAccessToken = false;
                req.body.needToClearCookie = false;
                req.body.needToClearRefreshToken = false;
                req.body.signInSkip = true;
                req.body.user_id = decoded.userId;
            }
            next();
        });
    }else{
        console.log('0-2-1. Access Token 유효성 검사 불필요');
        req.body.needToReissueAccessToken = false;
        next();
    }
});

// needToReissueAccessToken : Access Token 재발급 필요 여부 (true, false)
// signInSkip : 로그인 절차 생략 여부 (true = 생략, false = 생략하지 않음) - 로그인된 상태에서 로그인 시도하는 경우에 사용

// 3. Access Token 재발급 필요 유무 확인 및 재발급
router.all('*', async (req, res, next) => { // Access Token이 만료된 경우 재발급, 아니면 패스
    console.log('\n0-3. Access Token 재발급 필요 유무 확인 및 재발급');
    console.log('req.body.needToReissueAccessToken : ', req.body.needToReissueAccessToken);
    if(req.body.needToReissueAccessToken){ // Access Token 재발급 필요
        console.log('0-3-1. Access Token 만료됨. Refresh Token 조회');
        console.log('req.signedCookies.auth : ', req.signedCookies.auth);
        try{
            const conn = await ConnectionPool.getConnection();
            const data = await conn.query(`select * from login_token where user_id = '${req.signedCookies.auth.user_id}';`);
            console.log('0-3-2. DB에서 Access Token 조회 결과 : ', data[0]);
            if(data.length === 0){
                console.log('0-3-3. Access Token에 맞는 Refresh Token이 없음. 로그아웃 처리');
                req.body.needToClearCookie = true;
                req.body.needToClearRefreshToken = true;
                req.body.isLogout = true;
                next();
            }else{
                if(data[0].access_token !== req.signedCookies.auth.access_token){
                    console.log(data[0].access_token);
                    console.log(req.signedCookies.auth.access_token);
                    console.log('0-3-3. User Id 와 Access Token이 일치하지 않음.');
                    req.body.needToClearCookie = true;
                    req.body.needToClearRefreshToken = true;
                    req.body.isLogout = true;
                    next();
                }else{
                    console.log('0-3-3. refresh token 확인. 유효성 검사 시행');
                    jwt.verify(data[0].refresh_token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                        if(err){
                            console.log('0-3-4. Refresh Token 유효성 검사 중 에러 발생');
                            req.body.needToClearCookie = true;
                            req.body.needToClearRefreshToken = true;
                            req.body.isLogout = true;
                            console.log(err);
                            next();
                        }else{
                            console.log('0-3-4. Refresh Token 조회 성공. Access Token 발급 이력 확인됨');
                            console.log('decoded.expire : ', decoded.expire);
                            console.log('Date.now() : ', Date.now());
                            if(decoded.expire > Date.now()){
                                console.log('0-3-5. Refresh Token 유효. Access Token 재발급 시행');
                                req.body.access_token = accessToken(decoded.userId, process.env.JWT_SECRET_KEY);
                                console.log(req.body.access_token);
                                req.body.needToUpdateAccessToken = true;
                                next();
                            }else{
                                console.log('0-3-5. refresh token 만료. 다시 로그인 필요.');
                                req.body.needToClearCookie = true;
                                req.body.needToClearRefreshToken = true;
                                req.body.isLogout = true;
                                next();
                            }
                        } 
                    });
                }
            }
            conn.release();
        }catch(err){
            console.log('0-3-2. Refresh Token 체크 에러. 로그아웃 처리');
            console.log(err);
            req.body.needToClearCookie = true;
            req.body.needToClearRefreshToken = true;
            req.body.isLogout = true;
            next();
        }
    }else{ // 쿠키가 없거나, Access Token이 없거나 만료됨
        console.log('0-3-1. Access Token 재발급 불필요');
        next();
    }
});

// needToUpdateAccessToken : 재발급된 Access token 업로드 필요 여부 (true = 필요, false = 불필요)

// 4. Access Token이 재발급 된 경우 DB 업로드
router.all('*', async (req, res, next) => {
    console.log('\n0-4. Token 업로드 필요성 확인');
    console.log('req.body.needToUpdateAccessToken : ', req.body.needToUpdateAccessToken);
    if(req.body.needToUpdateAccessToken === true){ // 재발급된 Access Token DB에 등록
        console.log('0-4-1. Access Token DB에 업로드 필요');
        try{
            const conn = await ConnectionPool.getConnection();
            try{
                const data = await conn.query(`
                    update login_token set access_token = '${req.body.access_token}'
                        where user_id = '${req.signedCookies.auth.user_id}';`);
                console.log('0-4-2. 재발급된 Access Token, DB에 업로드 성공');
                console.log(data);
                req.body.signInSkip = true;
                res.cookie('auth', {user_id: req.signedCookies.auth.user_id, access_token: req.body.access_token}, {httpOnly: true, signed: true});
                next();
            }catch(err){
                console.log('0-4-2. 재발급된 Access Token, DB에 업로드 실패');
                req.body.isLogout = true;
                req.body.needToClearCookie = true;
                req.body.needToClearRefreshToken = true;
                console.log(err);
                next();
            }
            conn.release();
        }catch(err){
            console.log('0-3-2. DB 연결 에러');
            console.log(err);
            next();
        }   
    }else{
        console.log('0-4-1. Access Token DB에 업로드 불필요');
        next();
    }
});

// 5. Refresh Token이 만료됐거나 문제가 생긴 경우, Refresh Token 삭제
router.all('*', async (req, res, next) => {
    console.log('\n0-5. Refresh Token 삭제 필요성 여부');
    console.log('req.body.needToClearRefreshToken : ', req.body.needToClearRefreshToken);
    console.log('req.signedCookies.auth : ', req.signedCookies.auth);
    if(req.body.needToClearRefreshToken){
        console.log('0-5-1. Refresh Token 삭제 필요');
        try{
            const conn = await ConnectionPool.getConnection();
            if(req.signedCookies.auth !== undefined){
                if(req.signedCookies.auth.user_id !== undefined){
                    const data = await conn.query(`delete from login_token where user_id = '${req.signedCookies.auth.user_id}';`);
                }
                if(req.signedCookies.auth.access_token !== undefined){
                    const data2 = await conn.query(`delete from login_token where access_token = '${req.signedCookies.auth.access_token}';`);
                }
            }
            console.log('0-5-2. Refresh Token이 정상적으로 삭제됨');
            console.log(data);
            next();
        }catch(err){
            console.log('');
            next();
        }
    }else{
        console.log('0-5-1. Refresh Token 삭제 불필요');
        next();
    }
});

// 6. 쿠키 삭제 여부
router.all('*', (req, res, next) => {
    console.log('\n0-6. 쿠키 삭제 필요성 여부');
    console.log('req.body.needToClearCookie : ', req.body.needToClearCookie);
    if(req.body.needToClearCookie){
        console.log('0-6-1. 쿠키 삭제 필요');
        res.clearCookie('auth');
        next();
    }else{
        console.log('0-6-1. 쿠키 삭제 불필요');
        next();
    }
});

module.exports = router;