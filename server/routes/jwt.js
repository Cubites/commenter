const jwt = require('jsonwebtoken');

// login check
const accessToken = (data) => {
    const payload = {
        user_id : data,
        role: 'user'
    };

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: '10m'
    })
};

const refressToken = (data) => {
    let expireDate = new Date(Date.now() + (3 * 60 * 1000));

}

const accessTokenVerify = (token, secret) => {

}

module.exports = { accessToken, refressToken }