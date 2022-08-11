const jwt = require('jsonwebtoken');

// login check
const accessToken = (data) => {
    let token = jwt.sign({
        type: 'JWT',
        userId: data.userId
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: '10m'    
    });
    console.log('accessToken : ' + token);
    return token;
};

module.exports = { accessToken }