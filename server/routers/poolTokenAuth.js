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
    if(req.signedCookies.auth !== undefined){ // 로그인 쿠키 존재.
        console.log('0-1-1. 로그인 쿠키가 존재함. 내용 검사');
        req.body.existAccessToken = req.signedCookies.auth.access_token !== null && req.signedCookies.auth.access_token !== undefined;
        req.body.existUserId = req.signedCookies.auth.user_id !== null && req.signedCookies.auth.user_id !== undefined;
        if(req.body.existAccessToken && req.body.existUserId){// 로그인 쿠키가 존재하고 정보가 제대로 있음
            console.log('0-1-2. 올바른 로그인 쿠키');
            req.body.needToCheckAccessToken = true; // 로그인 쿠키 안의 Access token 유효성 검사 필요
            req.body.needToClearCookie = false; // Access Token의 유효성이 아직 검증되지 않았으므로 쿠키 삭제 판단 보류
            req.body.needToClearRefreshToken = false; // Access Token의 유효성 검사를 아직 하지 않았으므로 RefreshToken을 삭제 판단 보류
            req.body.isLogout = false; // Access Token의 유효성 검증이 아직 되지 않았으므로 로그인 유지 판단 보류
            next();
        }else{ // 로그인 쿠키는 존재하나 Access Token 혹은 User Id가 존재하지 않음
            console.log('0-1-2. 쿠키 정보가 올바르지 않음');
            req.body.needToCheckAccessToken = false; // 잘못된 로그인 쿠키는 검증할 필요가 없음
            req.body.needToClearCookie = true;  // 잘못된 로그인 쿠키는 없앨 필요가 있음
            req.body.needToClearRefreshToken = false; // 잘못된 로그인 쿠키이므로 RefreshToken을 검증할 필요가 없음 
            req.body.isLogout = true; // 잘못된 로그인 쿠키이므로 로그아웃 처리해야 함
            next();
        }
    }else{ // 로그인 쿠키가 존재하지 않음
        console.log('0-1-1. 쿠키 없음');
        req.body.needToCheckAccessToken = false; // 쿠키가 없으므로 Access Token도 없음. 따라서 유효성 검사를 할 필요가 없음
        req.body.needToClearCookie = false; // 쿠키가 없으므로 삭제할 필요가 없음
        req.body.needToClearRefreshToken = false; // 쿠키가 없으므로 로그인 상태가 아님. 따라서 RefreshToken을 지울 필요가 없음
        req.body.isLogout = false; // 쿠키가 없으므로 로그인 상태가 아님. 따라서 로그아웃을 할 필요가 없음
        next();
    }
});

// needToCheckAccessToken : Access Token 유효성 검사 필요 여부 (true = 필요, false = 불필요)
// needToClearCookie : 쿠키 삭제 필요 여부 (true = 필요, false = 불필요)
// needToClearRefreshToken : Refresh Token 삭제 필요 여부 (true = 필요, false = 불필요)
// isLogout : Logout 처리 필요 여부 (true = 필요, false = 불필요)

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
                    req.body.needToReissueAccessToken = true; // Access Token이 만료되었으므로 재발급 필요
                }else if(err.message == 'invalid token'){ // 잘못된 Access Token으로 접속 시도. 부정한 접근으로 간주하고 로그아웃처리
                    console.log('0-2-3. 잘못된 토큰 : ' + err);
                    req.body.needToReissueAccessToken = false; // 올바르지 않은 토큰이므로 재발급할 필요가 없음
                    req.body.needToClearCookie = true; // 올바르지 않은 토큰을 가진 쿠키이므로 삭제해야 함
                    req.body.needToClearRefreshToken = true; // 부정한 접근으로 간주. 로그인 상태 해제를 위해 Refresh Token 삭제 필요
                    req.body.isLogout = true; // 부정한 접근이므로 로그아웃처리
                }else{ // Access Token 유효성 검사 중 에러. 상황판단 불가로 안전을 위해 일단 로그아웃 처리
                    console.log('0-2-3. Access Token 유효성 확인 error : ' + err);
                    req.body.needToReissueAccessToken = false; // Access Token의 유효성 판단 불가. 재발급하지 않음
                    req.body.needToClearCookie = true; // 보안을 위해 해당 쿠키 삭제
                    req.body.needToClearRefreshToken = true; // 보안을 위해 Refresh Token 삭제
                    req.body.isLogout = true; // 보안을 위해 로그아웃 처리
                }
            }else{ // 유효한 Access Token. 로그인 유지
                console.log('0-2-3. 유효한 Access Token. 로그인 생태를 유지.');
                req.body.needToReissueAccessToken = false; // 유효한 Access Token이므로 재발급할 필요가 없음
                req.body.needToClearCookie = false; // 유효한 Access token을 지닌 쿠키이므로 삭제할 필요가 없음
                req.body.needToClearRefreshToken = false; // Access token이 유효하므로 Refresh Token을 삭제할 필요가 없음
                req.body.signInSkip = true; // 이미 로그인된 사용자이므로 로그인 절차 생략
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
        try{
            const conn = await ConnectionPool.getConnection();
            const data = await conn.query(`SELECT * FROM login_token WHERE user_id = '${req.signedCookies.auth.user_id}';`);
            console.log('0-3-2. DB에서 Access Token 조회 결과 : ', data[0]);
            if(data.length === 0){
                console.log('0-3-3. Access Token에 맞는 Refresh Token이 없음. 로그아웃 처리');
                req.body.needToClearCookie = true; // refresh Token이 없어 유효성 확인 불가. 불필요한 쿠키이므로 삭제 처리
                req.body.needToClearRefreshToken = false; // Access Token에 해당하는 Refresh Token가 없으므로 삭제할 필요가 없음
                req.body.isLogout = true; // Access Token이 유효하지 않으므로 로그아웃 처리
                next();
            }else{
                console.log('0-3-3. Access Token에 맞는 Refresh Token이 있음');
                if(data[0].access_token !== req.signedCookies.auth.access_token){ // 쿠키의 user_id와 DB의 user_id가 일치하지 않음
                    console.log('0-3-4. User Id 와 Access Token이 일치하지 않음.');
                    req.body.needToClearCookie = true; // 부정한 접근이므로 해당 쿠키 삭제
                    req.body.needToClearRefreshToken = true; // 부정한 접근이므로 보안을 위해 RefreshToken 삭제
                    req.body.isLogout = true; // 부정한 접근이므로 로그아웃 처리
                    next();
                }else{
                    console.log('0-3-4. Refresh Token 확인. Refresh Token 유효성 검사 시행');
                    jwt.verify(data[0].refresh_token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                        if(err){
                            console.log('0-3-5. Refresh Token 유효성 검사 중 에러 발생');
                            req.body.needToClearCookie = true; // 보안을 위해 쿠키 삭제
                            req.body.needToClearRefreshToken = true; // 보안을 위해 Refresh Token 삭제
                            req.body.isLogout = true; // 보안을 위해 로그아웃 처리
                            console.log(err);
                            next();
                        }else{
                            console.log('0-3-5. Refresh Token 조회 성공. Access Token 발급 이력 확인됨');
                            if(decoded.expire > Date.now()){ // Refresh Token이 유효한 경우
                                console.log('0-3-6. Refresh Token 유효. Access Token 재발급 시행');
                                req.body.access_token = accessToken(decoded.userId, process.env.JWT_SECRET_KEY);
                                req.body.needToUpdateAccessToken = true; // 재발급한 Access token을 DB에 업로드 필요
                                next();
                            }else{
                                console.log('0-3-6. Refresh Token 만료. 로그아웃 처리.');
                                req.body.needToClearCookie = true; // 로그아웃 처리와 같이 쿠키 삭제
                                req.body.needToClearRefreshToken = true; // Refresh Token이 만료되었으므로 삭제 필요
                                req.body.isLogout = true; // 로그아웃 처리
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
            req.body.needToClearCookie = true; // 보안을 위해 쿠키 삭제
            req.body.needToClearRefreshToken = true; // 보안을 위해 RefreshToken 삭제
            req.body.isLogout = true; // 보안을 위해 로그아웃 처리
            next();
        }
    }else{ // 쿠키가 없거나, Access Token이 없거나, 잘못된 Access Token이거나, Access Token이 유효함
        console.log('0-3-1. Access Token 재발급 불필요');
        next();
    }
});

// needToUpdateAccessToken : 재발급된 Access token 업로드 필요 여부 (true = 필요, false = 불필요)

// 4. Access Token이 재발급 된 경우 DB 업로드
router.all('*', async (req, res, next) => {
    console.log('\n0-4. Token 업로드 필요성 확인');
    console.log('req.body.needToUpdateAccessToken : ', req.body.needToUpdateAccessToken);
    if(req.body.needToUpdateAccessToken){ // 재발급된 Access Token DB에 등록
        console.log('0-4-1. Access Token DB에 업로드 필요');
        try{
            const conn = await ConnectionPool.getConnection();
            try{
                await conn.query(`
                    UPDATE login_token SET access_token = '${req.body.access_token}'
                    WHERE user_id = '${req.signedCookies.auth.user_id}';
                `);
                console.log('0-4-2. 재발급된 Access Token, DB에 업로드 성공');
                req.body.signInSkip = true; // Access Token을 재발급 받아 로그인 상태가 유지되었으므로 로그인 절차 생략
                res.cookie('auth', {user_id: req.signedCookies.auth.user_id, access_token: req.body.access_token}, {httpOnly: true, signed: true});
                next();
            }catch(err){
                console.log('0-4-2. 재발급된 Access Token, DB에 업로드 실패');
                req.body.needToClearCookie = true; // 안전을 위해 쿠키 삭제
                req.body.needToClearRefreshToken = true; // 안전을 위해 Refresh Token 삭제
                req.body.isLogout = true; // 안전을 위해 로그아웃 처리
                console.log(err);
                next();
            }
            conn.release();
        }catch(err){
            console.log('0-4-2. DB 연결 에러');
            console.log(err);
            req.body.needToClearCookie = true; // 안전을 위해 쿠키 삭제
            req.body.needToClearRefreshToken = true; // 안전을 위해 Refresh Token 삭제
            req.body.isLogout = true; // 안전을 위해 로그아웃 처리
            next();
        }   
    }else{ // 쿠키가 없거나, Access Token이 없거나, 잘못된 Access Token이거나, Access Token이 유효함
        console.log('0-4-1. Access Token DB에 업로드 불필요');
        next();
    }
});

// 5. Refresh Token이 만료됐거나 문제가 생긴 경우, Refresh Token 삭제
router.all('*', async (req, res, next) => {
    console.log('\n0-5. Refresh Token 삭제 필요성 여부');
    console.log('req.body.needToClearRefreshToken : ', req.body.needToClearRefreshToken);
    if(req.body.needToClearRefreshToken){ // Refresh Token을 삭제해야하는 경우(에러 혹은 만료)
        console.log('0-5-1. Refresh Token 삭제 필요');
        try{
            const conn = await ConnectionPool.getConnection();
            if(req.signedCookies.auth !== undefined){ // 쿠키가 있는 경우
                if(req.signedCookies.auth.user_id !== undefined){ // user_id가 있는 경우 user_id로 Refresh Token 삭제
                    await conn.query(`DELETE FROM login_token WHERE user_id = '${req.signedCookies.auth.user_id}';`);
                }
                if(req.signedCookies.auth.access_token !== undefined){ // access_token이 있는 경우 access_token으로 Refresh Token 삭제
                    await conn.query(`DELETE FROM login_token WHERE access_token = '${req.signedCookies.auth.access_token}';`);
                }
            }
            console.log('0-5-2. Refresh Token이 정상적으로 삭제됨');
            next();
        }catch(err){
            console.log('0-5-2. Refresh Token 삭제 중 에러');
            console.log(err);
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