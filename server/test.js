const dotenv = require('dotenv');
dotenv.config();

console.log('----------------------------------------------테스트----------------------------------------------');

// const ConnectionPool = require('./modules/ConnectionPool');

// console.log('process.env.TZ : ', process.env.TZ);

// const cccc = async () => {
//     try{
//         const conn = await ConnectionPool.getConnection();
//         const checkTime = await conn.query('select * from tt limit 1;');
//         console.log(checkTime);
//         conn.release();
//     }catch(err){
//         console.log('에러 발생');
//         console.log(err);
//     }
// }

// cccc();

// process.env.TZ = "Asia/Seoul";
// console.log(new Date().toString());