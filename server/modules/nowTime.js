const moment = require('moment-timezone');

const nowTime = () => {
    let jsTime = new Date();
    let times = {
        year: moment(jsTime.getTime()).tz('Asia/Seoul').format('YYYY'),
        month: moment(jsTime.getTime()).tz('Asia/Seoul').format('MM'),
        day: moment(jsTime.getTime()).tz('Asia/Seoul').format('DD'),
        hour: moment(jsTime.getTime()).tz('Asia/Seoul').format('HH'),
        minute: moment(jsTime.getTime()).tz('Asia/Seoul').format('mm'),
        seconds: moment(jsTime.getTime()).tz('Asia/Seoul').format('ss'),
        milliseconds: moment(jsTime.getTime()).milliseconds()
    };
    let now = `${times.year}-${times.month}-${times.day} ${times.hour}:${times.minute}:${times.seconds}.${times.milliseconds}`;
    return now;
}

module.exports = nowTime;