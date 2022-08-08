const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

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