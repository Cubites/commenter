const router = require('express').Router();

const Qna = require('../controller/Qna');

router.post('*/add', Qna.insert);

router.post('*/info', Qna.info);

router.post('*/search', Qna.search);


module.exports = router;