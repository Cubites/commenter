const jwt = require('jsonwebtoken');
const mariadb = require('mariadb');

// login check
const accessToken = (data, secret) => {
    const payload = {
        user_id : data,
        role: 'user'
    };

    return jwt.sign(payload, secret, {
        expiresIn: '10m'
    })
};

const refressToken = (data, secret) => {
    let expireDate = new Date(Date.now() + (3 * 60 * 60 * 1000));
    const payload = {
        accessToken : data,
        expire: expireDate
    };

    return {
        refressToken: jwt.sign(payload, secret, {}),
        expire: expireDate
    };
}

const accessTokenVerify = (token, secret) => {
    jwt.verify(token, secret, (err, decoded) => {
        if(err){
            // if(err.message == 'jwt expired'){

            // }
            console.log(err.message);
            return null;
        }
        console.log(decoded);
        return decoded;
    });
    return accessToken;
    // try{
    //     return jwt.verify(token, secret);
    // } catch (err) {
    //     return null;
    // }
}

module.exports = { accessToken, refressToken, accessTokenVerify };