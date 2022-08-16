const jwt = require('jsonwebtoken');

// login check
const accessToken = (data, secret) => {
    const payload = {
        userId: data,
        role: 'user'
    };

    return jwt.sign(payload, secret, {
        expiresIn: '10m'
    })
};

const refressToken = (user_id, accessToken, secret) => {
    let expireDate = Date.now() + (3 * 60 * 60 * 1000);
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