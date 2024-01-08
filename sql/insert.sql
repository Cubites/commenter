USE commenter;

-- 1. 코멘트 등록
DESC comment;
select * from comment where guest_ip = '185-125-0-1';
DELETE FROM comment WHERE guest_ip = '185-125-0-1';

DESC guest;
SELECT * FROM guest;

-- 2. 신고
DESC report;
SELECT * FROM report ORDER BY comment_id LIMIT 10;
SELECT count(*) FROM report;
SELECT * FROM report;
DELETE FROM report WHERE user_id = 'UI0000000060';

-- 3. 코멘트 삭제
SELECT * FROM comment ORDER BY comment_id DESC limit 1;

-- 4. 문의 전송
DESC qna;
SELECT * FROM qna ORDER BY qna_id DESC LIMIT 5;
DELETE FROM qna WHERE qna_id = 'QN0000000466';

-- 5. 로그인 토큰 테스트
SELECT * FROM login_token;

-- 종합 테스트
SELECT * FROM book;
SELECT * FROM book_favor LIMIT 5;
SELECT * FROM comment ORDER BY comment_id DESC LIMIT 5;
DELETE FROM comment WHERE comment_id = "CM0000000466"; 
SELECT * from report;
DELETE FROM report WHERE user_id = "UI0000000001" AND comment_id = "CM0000000001";
SELECT * FROM report WHERE user_id = "UI0000000001" ORDER BY comment_id DESC LIMIT 5;
SELECT * FROM qna ORDER BY qna_id DESC LIMIT 5;
DELETE FROM qna WHERE qna_id = "QN0000000466";

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
-- null AS like_set
FROM book bk
WHERE book_title LIKE '%%'
ORDER BY like_num DESC
LIMIT 0, 10;