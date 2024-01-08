const router = require('express').Router();

const Book = require('../controller/Book');

router.post('*/add', Book.addBook);

router.post('*/search', Book.search);

router.post('*/info', Book.info);

router.post('*/test', (req, res, next) => {
    console.log('router test.');
    res.status(200).send('라우터 테스트');
});

module.exports = router;