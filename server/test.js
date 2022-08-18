const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

let access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjYwNzk0MDQ5LCJleHAiOjE2NjA3OTQwNTl9.pOZHBnu25K-avkfR24WP6oUbEJm4aDXFHqKUoC6sPBA';
let refresh_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImFjY2Vzc1Rva2VuIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5U1dRaU9qRXNJbkp2YkdVaU9pSjFjMlZ5SWl3aWFXRjBJam94TmpZd056azBNRFE1TENKbGVIQWlPakUyTmpBM09UUXdOVGw5LnBPWkhCbnUyNUstYXZrZlIyNFdQNm9VYkVKbTRhRFhGSHFLVW9DNnNQQkEiLCJleHBpcmUiOjE2NjA4MDQ4NDk3NDQsImlhdCI6MTY2MDc5NDA0OX0.UlPRqPXc_IQs5VbzfPoeshw0gUSd1T6THZugHKP1_8E';
let refresh_expire = 1660804849744;

let secret = process.env.JWT_SECRET_KEY;

console.log('----------------------------------------------테스트----------------------------------------------');
// let results = jwt.verify(refresh_token, secret, (err, decoded) => {
//     if(err){
//         console.log('0-5. refresh token 검증 중 에러 발생');
//         console.log(err);
//         return { accessToken: null, isLogout: true }
//     }
//     if(decoded.accessToken == access_token){
//         console.log('0-5. access token 조회 성공');
//         console.log('user_id : ' + decoded.userId);
//         if(decoded.expire > Date.now()){
//             console.log('0-6. refresh token 유효. access token 재발급 시작');
//             const payload = {
//                 userId: decoded.userId,
//                 role: 'user'
//             };
//             return { 
//                 user_id: decoded.userId, 
//                 accessToken: jwt.sign(payload, secret, { expiresIn: '10m'}),
//                 isLogout: false
//             }
//         }else{
//             console.log('0-6. refresh token 만료. 다시 로그인 필요.');
//             conn.query(`delete from login_token where user_id = ${decoded.userId};`, (err) => {
//                 if(err){
//                     console.log('0-7. 만료된 refresh token 삭제 실패');
//                 }else{
//                     console.log('0-7. 만료된 refresh token 삭제 성공');
//                 }
//             });
//             return { accessToken: null, isLogout: true }
//         }
//     }
// });
// console.log('-- jwt.verify() 결과 출력 --');
// console.log(results);

const mariadb = require('mariadb');

const conn = mariadb.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    bigIntAsNumber: true,
    connectionLimit: 4
});

let result;
// conn.query(`select * from login_token where access_token = '${access_token}';`, (err, data) => {
//     if(err) return { accessToken: null, isLogout: true };
//     return data
// });

conn.query(`select * from login_token where access_token = '${access_token}';`)
    .then(data => {
        if(err) return { accessToken: null, isLogout: true };
        result = data
    })
    .catch(err => result = err);

console.log('-- conn.query() 결과 출력 --');
console.log(result);