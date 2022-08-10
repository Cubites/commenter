const express = require('express');
const bcrypt = require('bcrypt');
// const dotenv = require('dotenv');
const router = express.Router();

// dotenv.config({path: path.resolve(__dirname, '../.env')});

exports.authenticated = (plainPassword) => {
    bcrypt.genSalt(Number(process.env.SALT_ROUNDS), function (err, salt){
        if(err) throw err;
        bcrypt.hash(plainPassword, salt, function (err, hash){
            if(err) throw err;
            return hash;
        });
    });
}

exports.jwt = () => {
    
}