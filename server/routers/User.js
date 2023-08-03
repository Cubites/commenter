const router = require('express').Router();

const User = require('../controller/User');

router.post('*/login', User.check);
router.post('*/login', User.register);
router.post('*/login', User.token);

router.post('*/update', User.update);

router.post('*/info', User.info);


module.exports = router;