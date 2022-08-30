const dotenv = require('dotenv');
dotenv.config();

console.log('----------------------------------------------테스트----------------------------------------------');

// const ConnectionPool = require('./modules/ConnectionPool');


// console.log('process.env.TZ : ', process.env.TZ);

// const cccc = async () => {
//     try{
//         const conn = await ConnectionPool.getConnection();
//         const checkComment = await conn.query('select * from comment where comment_id = 30');
//         console.log(checkComment[0]);
//         conn.release();
//     }catch(err){
//         console.log('에러 발생');
//         console.log(err);
//     }
// }

// cccc();

// let value = '3';
// let value2 = ('0000000000' + value).slice(-10);
// console.log(value2);
console.log(Math.floor(Math.random() * 24, 0));