const router = require('express').Router();

const Connection = require('../modules/Connection');
const { accessToken, refressToken } = require('../modules/jwt');

// 1. 신규 유저인지 기존 유저인지 판별
router.post('/user/login', (req, res, next) => {
    console.log('1-1. 신규 유저인지 기존 유저인지 판별');
    Connection.query(`
        select user_id, ${req.body.login_method}_token as token from user 
            where ${req.body.login_method}_token = '${req.body.user_code}';`, (err, userInfo) => {
                if(err){
                    console.log('1-2. 잘못된 로그인 시도');
                    res.status(404).send({user_id: null, isLogout: true});
                }else{
                    if(userInfo.length !== 0){
                        console.log('1-2. 기존 유저임을 확인');
                        req.body.user_id = userInfo[0].user_id;
                        next();
                    }else{
                        console.log('1-2. 신규 유저임을 확인');
                        req.body.user_id = 0;
                        next();
                    }
                }
            })
});

// 2. 신규 유저인 경우, 회원가입 시행. 기존 유저는 생략
router.post('/user/login', (req, res, next) => {
    if(req.body.user_id === 0){
        console.log('4. 신규 유저로 판단, 회원가입 시작');
        Connection.query(`select Max(user_id) as last_user_num from user;`, (err, userCount) => {
            if(err){
                console.log('5. 신규 유저 아이디 생성 중 에러 발생. 회원가입 중지');
                res.status(404).send({user_id: null, isLogout: true});
            }else{
                console.log('5. 신규 유저 아이디 생성 완료');
                let newUserId = userCount[0].last_user_num + 1;
                Connection.query(`
                    insert user(user_id, nickname, ${req.body.login_method}_token)
                        value(${newUserId}, '${(Math.round(Math.random() * 1000000))}', '${req.body.user_code}');`, (err) => {
                            if(err){
                                console.log('6. 신규 유저 정보 저장 중 에러 발생. 회원가입 중지');
                                res.status(404).send({user_id: null, isLogout: true});
                            }else{
                                console.log('6. 신규 유저 정보 저장 완료');
                                req.body.user_id = newUserId;
                                next();
                            }
                        });
            }
        });
    }else{
        console.log('4. 기존 유저는 회원가입 절차 생략');
        next();
    }
});

// 3. Access Token, Refresh Token 발급
router.post('/user/login', (req, res, next) => {
    console.log('7. 토큰 발급 시작');
    if(req.body.user_id > 0){
        let access_token = accessToken(req.body.user_id, process.env.JWT_SECRET_KEY);
        let refresh_token = refressToken(req.body.user_id, access_token, process.env.JWT_SECRET_KEY);
        Connection.query(`
            insert login_token (user_id, access_token, refresh_token, refresh_expire)
                values(${req.body.user_id}, '${access_token}', '${refresh_token.refressToken}', ${refresh_token.expire});`, (err) => {
                    if(err){
                        console.log('8. 토큰 저장 실패, 재 로그인 권장');
                    }else{
                        console.log('8. 토크 저장 성공');
                    }
                });
    }else{
        next();
    }
});

module.exports = router;