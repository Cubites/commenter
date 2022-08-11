const express = require('express');
const bcrypt = require('bcrypt');
const mariadb = require('mariadb');

// const dotenv = require('dotenv');
// dotenv.config({path: path.resolve(__dirname, '../.env')});

const Mariadb = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    bigIntAsNumber: true
});



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