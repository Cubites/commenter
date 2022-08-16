const express = require('express');
const mariadb = require('mariadb');
const jwt = require('jsonwebtoken');

// const dotenv = require('dotenv');
// dotenv.config({path: path.resolve(__dirname, '../.env')});

const conn = mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    bigIntAsNumber: true,
    connectionLimit: 2
});

const refreshCheck = (accToken, secret) => {
    return conn.query(`select * from login_token where access_token = '${accToken}'`, (err, data) => {
        if(err) return { accessToken: null, isLogout: true };
        return jwt.verify(data[0].refresh_token, secret, (err, decoded) => {
            if(err){
                console.log(err);
                return { accessToken: null, isLogout: true }
            }
            if(decoded.accessToken == access_token){
                if(decoded.expire > Date.now()){
                    const payload = {
                        userId: user_id,
                        role: 'user'
                    };
                    console.log('accessToken 재발급');
                    return { user_id: user_id, accessToken: jwt.sign(payload, secret, { expiresIn: '10m'})}
                }else{
                    console.log('refresh token이 만료되었습니다. 다시 로그인해주세요.');
                    return { accessToken: null, isLogout: true }
                }
            }
        });
    })
}

exports.accessCheck = (access_token, secret) => {
    return jwt.verify(access_token, secret, (err, decoded) => {
        if(err){
            if(err.message == 'jwt expired'){
                console.log('accessToken이 만료되었습니다.');
                return refreshCheck(access_token, secret);
            }else if(err.message == 'invalid token'){
                console.log('잘못된 토큰 : ' + err);
                return { accessToken: null, isLogout: true }
            }else{
                console.log('access token error : ' + err);
                return { accessToken: null, isLogout: true }
            }
        }
        return { accessToken: null, isLogout: false }
    });
}