const axios = require('axios');
const ConnectionPool = require('../modules/ConnectionPool');

/*
    * 검색 종류 
        - 전체 검색(query=검색내용)
        - 책 제목 검색(d_titl=책제목)
        - ISBN 검색(d_isbn=isbn값)
    * 검색 옵션
        - 검색결과 출력 건수(display=출력갯수)
        - 검색 시작위치(start=검색위치숫자)
        - 정렬 옵션(sort=sim(유사도순) or sort=date(출간일순))
*/


let Book = {}

Book.test = (req, res, next) => {
    res.status(200).send('Book 모듈 통신 테스트 성공');
}

// 1. 네이버 북 API에서 책 정보 호출
Book.addBook = async (req, res, next) => {
    console.log("admin_1-1. 도서 추가");
    let options = {
        method: 'get',
        url: 'https://openapi.naver.com/v1/search/book.json',
        headers: {
            'X-Naver-Client-Id':process.env.NAVER_CLIENT_ID, 
            'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
        },
        params: req.body
    };

    await axios(options)
        .then((rs) => {
            console.log("admin_1-1-1. api 데이터 요청 성공");
            req.body.isResponseBooks = true;
            req.body.items = rs.data.items;
            // res.status(200).send(rs.data.items); // 테스트 코드(책 api 데이터 요청결과 출력)
        })
        .then(async () => {
            // 2. API로 받아온 책 정보를 DB에 추가
            if(req.body.isResponseBooks){
                try{
                    console.log('admin_1-2. DB에 책 정보 추가');
                    const conn = await ConnectionPool.getConnection();
                    req.body.items.forEach(async (item, index) => {
                        try{
                            await conn.query(`
                                insert book (isbn, book_title, image_url, author, publisher, publication, discount, sale_link)
                                    value (?, ?, ?, ?, ?, ?, ?, ?)`, [
                                    item.isbn,
                                    item.title,
                                    item.image,
                                    item.author,
                                    item.publisher,
                                    item.pubdate,
                                    item.discount,
                                    item.link
                                    ]);
                        }catch(err){
                            if(err.code === 'ER_DUP_ENTRY'){
                                console.error(`${index}번째 책은 이미 등록된 책입니다.`);
                            }else{
                                console.log('확인되지 않은 에러입니다.');
                                console.log(err);
                            }
                        }
                    });
                    console.log('admin_1-2-1. DB에 책 정보 추가 성공');
                    res.status(200).send({
                        isResponseBooks: req.body.isResponseBooks,
                        bookAddSuccess: true,
                        items: req.body.items
                    });
                    conn.release();
                }catch(err){
                    console.log('admin_1-2-1. DB 연결 에러');
                    console.log(err);
                    conn.release();
                    res.status(400).send({
                        isResponseBooks: req.body.isResponseBooks,
                        bookAddSuccess: false,
                        items: req.body.items
                    });
                }
            }
        })
        .catch(err => {
            console.log('admin_1-1-1. 책 정보 요청 에러');
            res.send(err);
            req.body.isResponseBooks = false;
        });
}

Book.search = async (req, res, next) => {
    console.log('2-1. 책 검색');
    try{
        const conn = await ConnectionPool.getConnection();
        try{
            // 1. 검색어에 대한 책 목록 조회
            // * 로그인 상태인 경우 - 로그인한 유저가 좋아요한 책인가 정보 요청
            // * 로그인 상태가 아닌 경우 - 로그인한 유저가 좋아요한 책인가 정보 요청 X
            let books = await conn.query(`
                SELECT 
                    bk.isbn
                    , bk.book_title
                    , bk.image_url
                    , bk.author
                    , bk.publisher
                    , bk.publication
                    , bk.discount
                    , bk.sale_link
                    , (SELECT COUNT(*) FROM book_favor bf1 WHERE bf1.isbn = bk.isbn) as like_num
                    ${
                        req.body.user_id !== null ?
                        `, (SELECT is_book_favor FROM book_favor bf2 where bf2.user_id = '${req.body.user_id}' and bf2.isbn = bk.isbn) as like_set` :
                        `, null AS like_set`
                    }
                FROM book bk
                WHERE book_title LIKE '%${req.body.search}%'
                ORDER BY ${req.body.sort === '0' ? 'bk.publication' : 'like_num'} DESC
                LIMIT ${Number(req.body.item_size) * (Number(req.body.page_num) - 1)}, ${Number(req.body.item_size)};
            `);
            conn.release();
            res.status(200).send(books);
        }catch(err){
            conn.release();
            console.log('2-1-2. 책 검색 처리 중 에러');
            console.log(err);
            res.status(404).send({success: false, err: err});
        }
    }catch(err){
        console.log('2-1-2. DB 연결 에러');
        console.log(err);
        res.status(404).send({success: false, err: err});
    }
}

Book.info = async (req, res, next) => {
    console.log('4-1. 책 상세정보 조회 시작');
    try{
        console.log('4-1-1. DB 연결');
        const conn = await ConnectionPool.getConnection();
        try{
            // 1. 도서 정보 + 로그인한 유저의 좋아요
            console.log('4-1-2. 정보 조회 시작');
            const bookData = await conn.query(`
                SELECT 
                    bk.book_title
                    , bk.author
                    , bk.publisher
                    , bk.image_url
                    , bk.discount
                    , bk.isbn
                    , bk.sale_link
                    , bk.publication
                    ${
                        req.body.user_id === null ?
                        `
                        , (
                            SELECT 
                                is_book_favor
                            FROM book_favor bf WHERE user_id = '${req.body.user_id}' and isbn = bk.isbn
                        ) AS book_favor
                        ` :
                        ', null AS book_favor'
                    }
                FROM book bk
                WHERE bk.isbn = '${req.body.isbn}';
            `);
            
            const tagData = await conn.query(`
                SELECT
                    tg.tag_id
                    , tg.tag_name
                FROM tag tg
                    INNER JOIN book_tag bt 
                    on bt.tag_id = tg.tag_id
                    INNER JOIN book bk 
                    ON bk.isbn = bt.isbn
                WHERE bk.isbn = '${req.body.isbn}';
            `);
            conn.release();
            res.status(200).send({
                ...bookData[0],
                tag: tagData
            });
        }catch(err){
            conn.release();
            console.log('4-1-3. 책 상세정보 조회 중 에러');
            console.log(err);
            res.status(404).send({success: false, err: err});
        }
    }catch(err){
        console.log('4-1-2. DB 연결 에러');
        console.log(err);
        res.status(404).send({success: false, err: err});
    }
}


module.exports = Book;