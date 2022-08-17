// // let expireDate = Date.now() + (3 * 60 * 60 * 1000);
// // console.log(expireDate);
// // console.log(Date(expireDate));
// // console.log(typeof(expireDate));

// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// let user_id = 1
// let accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlhdCI6MTY2MDYzMjg3NywiZXhwIjoxNjYwNjMyODg3fQ.whJuSHMJQGCT3fqyK_DtIn1FjxDvWYskPqNXsId44js'
// let refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUp5YjJ4bElqb2lkWE5sY2lJc0ltbGhkQ0k2TVRZMk1EWXpNamczTnl3aVpYaHdJam94TmpZd05qTXlPRGczZlEud2hKdVNITUpRR0NUM2ZxeUtfRHRJbjFGanhEdldZc2tQcU5Yc0lkNDRqcyIsImV4cGlyZSI6MTY2MDY0MzY3Nzk0NCwiaWF0IjoxNjYwNjMyODc3fQ.WlWnHKUBbvU8R3dlR1DI-Fs0dLK1VkHY5nSxvb_LmVM';

// let accessToken2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjYwNjQxODYzLCJleHAiOjE2NjA2NDI0NjN9.Z35Iauf4H6GDqnjBqo52g-VfGBfPcpe4f3gbnToh57E';

// const accessCheck = (access_token, secret) => {
//     return jwt.verify(access_token, secret, (err, decoded) => {
//         if(err){
//             if(err.message == 'jwt expired'){
//                 console.log('accessToken이 만료되었습니다.');
//                 return refreshCheck(access_token, secret);
//             }else if(err.message == 'invalid token'){
//                 console.log('로그아웃 처리');
//             }else{
//                 console.log('access token error : ' + err);
//             }
//         }
//         return decoded;
//     });
// }

// const refreshCheck = (access_token, secret) => {
//     let accessToken = '';
//     jwt.verify(refreshToken, secret, (err, decoded) => {
//         if(err){
//             if(err.message == 'jwt expired'){
//                 console.log('refresh token이 만료되었습니다. 다시 로그인 해주세요.');
//             }else{
//                 console.log('refresh err : ' + err);
//             }
//         }
//         if(decoded.accessToken == access_token){
//             if(decoded.expire > Date.now()){
//                 const payload = {
//                     userId: user_id,
//                     role: 'user'
//                 };
//                 console.log('accessToken 재발급');
//                 accessToken = jwt.sign(payload, secret, {
//                     expiresIn: '10m'
//                 });
//             }
//         }
//     });
//     return accessToken;
// }

// let newAccessToken = accessCheck(accessToken2, process.env.JWT_SECRET_KEY);
// console.log(newAccessToken);

console.log(Date.now());

1660720802378
1660724245738