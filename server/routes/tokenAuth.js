const express = require('express');
const router = express.Router();

const { conn } = require('./conn');

router.post('/test', (req, res, next) => {
    conn.query('select * from user;', (err, data) => {
        if(err){
            req.body.result = {
                result: '에러',
                detail: err
            }
        }else{
            req.body.result = {
                result: '성공',
                detail: data
            }
        }
        next();
    })
});

module.exports = router;