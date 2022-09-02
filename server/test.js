const dotenv = require('dotenv');
const moment = require('moment-timezone');
dotenv.config();

console.log('----------------------------------------------테스트----------------------------------------------');

const nowDate = new Date('2022-08-01');
console.log(nowDate.getTime());