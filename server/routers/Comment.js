const router = require('express').Router();

const Comment = require('../controller/Comment');

router.post('*/insert', Comment.insert);

router.post('*/delete', Comment.delete);

router.post('*/info', Comment.info);

router.post('*/report', Comment.report);


module.exports = router;