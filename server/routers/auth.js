const jwt = require('jsonwebtoken');

const { accessToken, refressToken } = require('../modules/jwt');

const refreshCheck = (accToken, secret, conn) => {
    console.log('0-3. access token 만료됨. refresh token 조회');
    let access_token = '';
    console.log(accToken);
    conn.query(`select * from login_token where access_token = '${accToken}';`, (err, data) => {
        if(err) return { accessToken: null, isLogout: true };
        console.log('0-4. refresh token 체크');
        console.log(data);
        return jwt.verify(data[0].refresh_token, secret, (err, decoded) => {
            if(err){
                console.log('0-5. refresh token 검증 중 에러 발생');
                console.log(err);
                return { accessToken: null, isLogout: true }
            }
            if(decoded.accessToken == accToken){
                console.log('0-5. access token 조회 성공');
                if(decoded.expire > Date.now()){
                    console.log('0-6. refresh token 유효. access token 재발급 시작');
                    const payload = {
                        userId: decoded.userId,
                        role: 'user'
                    };
                    return { 
                        user_id: decoded.userId, 
                        accessToken: jwt.sign(payload, secret, { expiresIn: '10m'}),
                        isLogout: false
                    }
                }else{
                    console.log('0-6. refresh token 만료. 다시 로그인 필요.');
                    conn.query(`delete from login_token where user_id = ${decoded.userId};`, (err) => {
                        if(err){
                            console.log('0-7. 만료된 refresh token 삭제 실패');
                        }else{
                            console.log('0-7. 만료된 refresh token 삭제 성공');
                        }
                    });
                    return { accessToken: null, isLogout: true }
                }
            }
        });
    });
}

exports.accessCheck = (access_token, secret, conn) => {
    console.log('0-1. access token 유효성 확인');
    // accessToken이 있으면 accessToken 재발급, null이면 재발급할 필요 없음
    // isLogout이 true면 로그아웃 처리, false면 로그인 상태 유지
    return jwt.verify(access_token, secret, (err, decoded) => {
        if(err){
            if(err.message == 'jwt expired'){ // accessToken 만료. refreshToken 체크
                console.log('0-2. accessToken이 만료되었습니다.');
                let isAccessToken = refreshCheck(access_token, secret, conn);
                console.log('0-6-1. isAccessToken 값 출력 : ');
                console.log(isAccessToken);
                if(isAccessToken.accessToken !== null){
                    conn.query(`update login_token set access_token where user_id = '${isAccessToken.user_id}';`, (err) => {
                        if(err){
                            console.log('0-7. 재발급된 accessToken을 DB에 업로드 실패');
                            console.log(err);
                        }else{
                            console.log('0-7. 재발급된 accessToken을 DB에 업로드 성공');
                        }
                    })
                }
                return isAccessToken;
            }else if(err.message == 'invalid token'){ // 잘못된 accessToken으로 접속 시도. 부정 사용자로 간주하고 로그아웃처리
                console.log('0-2. 잘못된 토큰 : ' + err);
                return { accessToken: null, isLogout: true }
            }else{ // accessToken 유효성 검사 중 에러. 상황판단 불가로 일단 로그아웃 처리
                console.log('0-2. accessToken verifying error : ' + err);
                return { accessToken: null, isLogout: true }
            }
        }
        return { accessToken: null, isLogout: false } // 유효한 accessToken. 로그인 유지
    });
}