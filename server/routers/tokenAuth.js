const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Connection = require('../modules/Connection');
const { accessToken } = require('../modules/jwt');

// 1. Access Token 유효성 검사
router.all('*', (req, res, next) => {
    console.log('0-1-1. Access Token 유무 확인');
    console.log('req.body : ', req.body);
    if(req.signedCookies.auth !== undefined){ // Access token 존재.
        console.log('0-1-2. Access Token 존재. 유효성 확인');
        console.log(req.signedCookies.auth);
        jwt.verify(req.signedCookies.auth.access_token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            console.log('Access Token 유효성 검사 결과 : ', decoded);
            if(err){
                if(err.message == 'jwt expired'){ // Access Token 만료. refreshToken 체크
                    console.log('0-1-3. Access Token 유효기간 만료.');
                    req.body.isAccessVerity = false;
                    req.body.isLogout = false;
                }else if(err.message == 'invalid token'){ // 잘못된 Access Token으로 접속 시도. 부정 사용자로 간주하고 로그아웃처리
                    console.log('0-1-3. 잘못된 토큰 : ' + err);
                    req.body.isAccessVerity = false;
                    req.body.isLogout = true;
                }else{ // Access Token 유효성 검사 중 에러. 상황판단 불가로 일단 로그아웃 처리
                    console.log('0-1-3. Access Token 유효성 확인 error : ' + err);
                    req.body.isAccessVerity = false;
                    req.body.isLogout = true;
                }
                next();
            }else{ // 유효한 Access Token. 로그인 유지
                console.log('0-1-3. 유효한 Access Token. 로그인 생태를 유지.');
                req.body.isAccessVerity = true;
                req.body.isLogout = false;
                req.body.user_id = decoded.userId;
                next()
            }
        });
    }else{ // Access Token 없음
        console.log('0-1-2. Access Token이 없음. 로그인이 되어있지 않음');
        req.body.isAccessVerity = null;
        req.body.isLogout = false;
        next();
    }
});

// 2. Access Token 재발급 필요 유무 검사 및 재발급
router.all('*', (req, res, next) => { // Access Token이 만료된 경우 재발급, 아니면 패스
    console.log('0-2-1. Access Token 재발급 필요성 확인');
    if(req.body.isAccessVerity === false && req.body.isLogout === false){ // Access Token 만료
        console.log('0-2-2. Access Token 만료됨. Refresh Token 조회');
        Connection.query(`select * from login_token where access_token = '${req.signedCookies.auth.accessToken}';`, (err, data) => {
            if(err){
                console.log('0-2-3. refresh token 체크 에러. 로그아웃 처리');
                req.body.isLogout = true;
                req.body.isRefreshVerify = null;
                next();
            }else{
                console.log('DB에서 Access Token 조회 결과 : ', data);
                if(data.length === 0){
                    console.log('0-2-3. Access Token에 맞는 refresh Token이 없음. 로그아웃 처리');
                    req.body.isLogout = true;
                    req.body.isRefreshVerify = false;
                    next();
                }else{
                    console.log('0-2-3. refresh token 확인. 유효성 검사 시행');
                    jwt.verify(data[0].refresh_token, secret, (err, decoded) => {
                        if(err){
                            if(err.message == 'jwt expired'){
                                console.log('0-2-4. Refresh Token이 만료됨. 로그아웃 처리');
                            }else{
                                console.log('0-2-4. Refresh Token 유효성 검사 중 에러 발생');
                            }
                            console.log(err);
                            req.body.isLogout = true;
                            req.body.isRefreshVerify = false;
                            next();
                        }else{
                            console.log('0-2-4. Refresh Token 조회 성공. Access Token 발급 이력 확인됨');
                            if(decoded.expire > Date.now()){
                                console.log('0-2-5. refresh token 유효. access token 재발급 시행');
                                req.body.isRefreshVerify = true;
                                req.body.accessToken = accessToken(decoded.userId, process.env.JWT_SECRET_KEY);
                                res.cookie(
                                    'auth', 
                                    {user_id: req.body.user_id, access_token : req.body.accessToken}, 
                                    {httpOnly: true, signed: true}
                                );
                                next();
                            }else{
                                console.log('0-2-5. refresh token 만료. 다시 로그인 필요.');
                                req.body.isLogout = true;
                                req.body.isRefreshVerify = false;
                                next();
                            }
                        } 
                    });
                }
            }
            Connection.end();
        });
    }else{ // Access Token이 없거나 만료됨
        if(req.body.isLogout === true){
            console.log('0-2-2. Access Token 재발급 불필요(로그아웃 처리 예정)');
        }else if(req.body.isAccessVerity === null && req.body.isLogout === false){
            console.log('0-2-2. Access Token 재발급 불필요(로그인 상태가 아님)')
        }else if(req.body.isAccessVerity === true){
            console.log('0-2-2. Access Token 재발급 불필요(토큰 유효)');
        }else{
            console.log('0-2-2. Access Token 재발급 불필요(원인 불명)');
        }
        req.body.isRefreshVerify = null;
        next();
    }
});

// 3. Access Token이 재발급 된 경우 DB 업로드, Refresh Token이 만료된 경우 해당 데이터 삭제
router.all('*', (req, res, next) => {
    console.log('0-3-1. Token 업로드 필요성 확인');
    console.log(req.body);
    if(req.body.isRefreshVerify === true){ // 재발급된 Access Token DB에 등록
        console.log('0-3-2. Access Token이 재발급 됨. DB의 Access Token 업로드')
        Connection.query(`update login_token set access_token where user_id = '${req.signedCookies.auth.user_id}';`, (err) => {
            if(err){
                console.log('0-3-3. 재발급된 Access Token, DB에 업로드 실패');
                console.log(err);
            }else{
                console.log('0-3-3. 재발급된 Access Token, DB에 업로드 성공');
            }
            Connection.end();
            next();
        });
    }else if(req.body.isRefreshVerify === false){
        console.log('0-3-2. Refresh Token이 만료되어 DB에서 삭제');
        Connection.query(`delete from login_token where user_id = ${req.signedCookies.auth.user_id};`, (err) => {
            if(err){
                console.log('0-3-3. 만료된 Refresh Token이 정상적으로 삭제됨');
            }else{
                console.log('0-3-3. 만료된 Refresh Token 삭제 중 에러 발생');
                console.log(err);
            }
            Connection.end();
            next();
        });
        next();
    }else{
        if(req.body.isLogout === true){
            console.log('0-3-2. Access Token 재발급 불필요(로그아웃 처리 예정)');
        }else if(req.body.isAccessVerity === null && req.body.isLogout === false){
            console.log('0-3-2. Access Token 재발급 불필요(로그인 상태가 아님)')
        }else if(req.body.isAccessVerity === true){
            console.log('0-3-2. Access Token 재발급 불필요(토큰 유효)');
        }else{
            console.log('0-3-2. Access Token 재발급 불필요(원인 불명)');
        }
        next();
    }
});

module.exports = router;