const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Connection = require('../modules/Connection');
const { accessToken } = require('../modules/jwt');

// 1. Access Token 유효성 검사
router.all('*', (req, res, next) => {
    console.log(req.body);
    console.log('0-1. access token이 있는지 확인');
    if(req.signedCookies.auth !== undefined){
        console.log('0-2. Access Token 존재. 유효성 체크 시작');
        console.log(req.signedCookies);
        jwt.verify(req.signedCookies.auth.access_token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            console.log(decoded);
            if(err){
                if(err.message == 'jwt expired'){ // Access Token 만료. refreshToken 체크
                    console.log('0-2. Access Token 유효기간 만료.');
                    req.body.isAccessVerity = false;
                    req.body.isLogout = false;
                }else if(err.message == 'invalid token'){ // 잘못된 Access Token으로 접속 시도. 부정 사용자로 간주하고 로그아웃처리
                    console.log('0-2. 잘못된 토큰 : ' + err);
                    req.body.isAccessVerity = false;
                    req.body.isLogout = true;
                }else{ // Access Token 유효성 검사 중 에러. 상황판단 불가로 일단 로그아웃 처리
                    console.log('0-2. Access Token 유효성 검사 error : ' + err);
                    req.body.isAccessVerity = false;
                    req.body.isLogout = true;
                }
                next();
            }else{ // 유효한 Access Token. 로그인 유지
                console.log('0-2. 유효한 Access Token. 로그인 생태를 유지.');
                // req.body.user_id = decoded;
                req.body.isAccessVerity = true;
                req.body.isLogout = false;
                next()
            }
        });
    }else{
        console.log('0-2. Access Token이 없음. 로그인이 되어있지 않음');
        req.body.isAccessVerity = null;
        req.body.isLogout = false;
        next();
    }
});

// 2. Access Token 재발급 필요 유무 검사 및 재발급
router.all('*', (req, res, next) => { // Access Token이 만료된 경우 재발급, 아니면 패스
    console.log(req.body);
    if(req.body.isAccessVerity === false && req.body.isLogout === false){
        console.log('0-3. Access Token 만료됨. Refresh Token 조회');
        Connection.query(`select * from login_token where access_token = '${req.signedCookies.auth.access_token}';`, (err, data) => {
            if(err){
                console.log('0-4. refresh token 체크 에러. 로그아웃 처리');
                req.body.isLogout = true;
                req.body.isRefreshVerify = null;
                next();
            }else{
                console.log('0-4. refresh token 확인. 유효성 검사 시행');
                console.log(data);
                jwt.verify(data[0].refresh_token, secret, (err, decoded) => {
                    if(err){
                        if(err.message == 'jwt expired'){
                            console.log('0-5. Refresh Token이 만료됨. 로그아웃 처리');
                        }else{
                            console.log('0-5. Refresh Token 유효성 검사 중 에러 발생');
                        }
                        console.log(err);
                        req.body.isLogout = true;
                        req.body.isRefreshVerify = false;
                        next();
                    }else{
                        console.log('0-5. Refresh Token 조회 성공. Access Token 발급 이력 확인됨');
                        if(decoded.expire > Date.now()){
                            console.log('0-6. refresh token 유효. access token 재발급 시행');
                            req.body.isRefreshVerify = true;
                            req.body.accessToken = accessToken(decoded.userId, process.env.JWT_SECRET_KEY);
                            res.cookie(
                                'auth', 
                                {user_id: req.body.user_id, access_token : req.body.accessToken}, 
                                {httpOnly: true, signed: true}
                            );
                            next();
                        }else{
                            console.log('0-6. refresh token 만료. 다시 로그인 필요.');
                            req.body.isLogout = true;
                            req.body.isRefreshVerify = false;
                            next();
                        }
                    } 
                });
            }
            Connection.end();
        });
    }else{
        if(req.body.isLogout === true){
            console.log('0-3. Access Token 재발급 불필요(로그아웃 처리 예정)');
        }else if(req.body.isAccessVerity === null && req.body.isLogout === false){
            console.log('0-3. Access Token 재발급 불필요(로그인 상태가 아님)')
        }else if(req.body.isAccessVerity === true){
            console.log('0-3. Access Token 재발급 불필요(토큰 유효)');
        }else{
            console.log('0-3. Access Token 재발급 불필요(원인 불명)');
        }
        req.body.isRefreshVerify = null;
        next();
    }
});

// 3. Access Token이 재발급 된 경우 DB 업로드, Refresh Token이 만료된 경우 해당 데이터 삭제
router.all('*', (req, res, next) => {
    console.log(req.body);
    if(req.body.isRefreshVerify === true){
        console.log('0-7. Access Token이 재발급 됨. DB의 Access Token 업로드')
        Connection.query(`update login_token set access_token where user_id = '${req.signedCookies.auth.user_id}';`, (err) => {
            if(err){
                console.log('0-7. 재발급된 Access Token을 DB에 업로드 실패');
                console.log(err);
            }else{
                console.log('0-7. 재발급된 Access Token을 DB에 업로드 성공');
            }
            Connection.end();
            next();
        });
    }else if(req.body.isRefreshVerify === false){
        console.log('0-6. Refresh Token이 만료되어 DB에서 삭제');
        Connection.query(`delete from login_token where user_id = ${req.signedCookies.auth.user_id};`, (err) => {
            if(err){
                console.log('0-7. 만료된 Refresh Token이 정상적으로 삭제됨');
            }else{
                console.log('0-7. 만료된 Refresh Token 삭제 중 에러 발생');
                console.log(err);
            }
            Connection.end();
            next();
        });
    }else{
        console.log('0-4. Access Token이 재발급 되지 않음(토큰 유효, 로그인 상태가 아님, 로그아웃 처리 예정)');
        next();
    }
});

module.exports = router;