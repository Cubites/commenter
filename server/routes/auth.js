const express = require('express');
const bcrypt = require('bcrypt');
// const dotenv = require('dotenv');
const router = express.Router();

// dotenv.config({path: path.resolve(__dirname, '../.env')});

exports.authenticated = (req, res, next) => {
    const check = req.body.user_code;
    bcrypt.genSalt(Number(process.env.SALT_ROUNDS), function (err, salt){
        if(err) return next('salt error' + err);
        bcrypt.hash(check, salt, function (err, hash){
            if(err) return next('bcrypt err' + err);
            req.body.user_code = hash;
            next();
        });
    });
}

exports.jwt = () => {
    
}