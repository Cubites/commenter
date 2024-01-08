/* 특수문자 변환기 */
const translator = (sentense) => {
    sentense = sentense.replaceAll('&#34;', '"');
    return sentense;
}

module.exports = translator;