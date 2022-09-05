const dotenv = require('dotenv');
const moment = require('moment-timezone');
dotenv.config();

console.log('----------------------------------------------테스트----------------------------------------------');


const ddd = {aaa: null};
if(ddd.aaa){
    console.log('true?');
}else{
    console.log('false');
}