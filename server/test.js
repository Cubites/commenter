const mariadb = require('mariadb');
const dotenv = require('dotenv');
dotenv.config();

console.log('----------------------------------------------테스트----------------------------------------------');

const Connection = require('./modules/Connection');

// Connection.query(`select * from user;`, (err, data) => {
//     console.log('조회 테스트 케이스 1');
//     if(err) console.log('조회 에러 발생 : ', err);
//     console.log('조회 결과 데이터 : ', data);

//     Connection.end();
// });

// Connection.query(`select * from user;`, (err, data) => {
//     console.log('조회 테스트 케이스 2');
//     if(err) {
//         console.log('조회 에러 발생 : ', err);
//     }else{
//         console.log('조회 결과 데이터 : ', data);
//     }

//     Connection.end();
// });

Connection.query(`insert user (user_id, nickname, n_token) values (100, 'testUser', 'kekerlkrlldv');`, (err, data) => {
    if(err){
        console.log('데이터 삽입 에러 발생 : ', err);
    }else{
        console.log('데이터 삽입 결과 데이터 : ', data);
    }
    Connection.end();
});

Connection.query(`select * from user;`, (err, data) => {
    if(err) {
        console.log('조회 에러 발생 : ', err);
    }else{
        console.log('조회 결과 데이터 : ', data);
    }

    Connection.end();
});

Connection.query(`delete from user where user_id = 100;`, (err, data) => {
    if(err) {
        console.log('데이터 삭제 에러 발생 : ', err);
    }else{
        console.log('데이터 삭제 결과 데이터 : ', data);
    }
    Connection.end();
});
