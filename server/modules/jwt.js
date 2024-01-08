const jwt = require('jsonwebtoken');

// login check
const accessToken = (data, secret) => {
    console.log('Access Token 발급 시작');
    const payload = {
        userId: data,
        role: 'user'
    };

    return jwt.sign(payload, secret, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
    })
};

const refressToken = (user_id, accessToken, secret) => {
    console.log('Refresh Token 발급 시작');
    let expireDate = Date.now() + (Number(process.env.REFRESH_TOKEN_EXPIRES_IN) * 60 * 1000);
    console.log('refressToken expireDate : ' + expireDate);
    const payload = {
        userId : user_id,
        accessToken : accessToken,
        expire: expireDate
    };

    return {
        refressToken: jwt.sign(payload, secret, {}),
        expire: expireDate
    };
}

module.exports = { accessToken, refressToken };