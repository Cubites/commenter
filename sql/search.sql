use commenter;

-- 테이블 구조 조회
desc user_info;
desc book;
desc book_favor;
desc book_tag;
desc comment;
desc comment_favor;

-- 테이블 데이터 조회
select * from user_info limit 5;
select * from comment limit 5;
select * from comment_favor limit 5;
select * from book limit 5;
select * from book_favor limit 5;
select * from report limit 5;

-- 테이블 구조 변경
alter table book_favor change bookmark_cancel book_favor_cancel tinyint(1);
ALTER TABLE comment_favor change comment_favor_cancel is_comment_favor tinyint(1);
ALTER TABLE book_favor change book_favor_cancel is_book_favor tinyint(1);

-- 쿼리문

SELECT * FROM comment_favor WHERE user_id = 'UI0000000005';
SELECT * FROM book LIMIT 5;
-- 1. 도서 검색 쿼리
SELECT
   bk.isbn
   , bk.book_title
   , bk.image_url
   , bk.author
   , bk.publisher
   , bk.publication
   , bk.discount
   , bk.sale_link
   , (select count(*) from book_favor where isbn = bk.isbn) as favor_num
   , (select bf.is_book_favor FROM book_favor bf WHERE user_id = 'UI0000000005' and isbn = bk.isbn
   	) as book_favor
from book bk
-- WHERE book_title LIKE '%파이썬%'
order by favor_num desc
limit 0, 10;

-- 2. 도서 상세 페이지 데이터 조회 쿼리
-- -- 2-1. 도서 정보
SELECT 
	bk.book_title
	, bk.author
	, bk.publisher
	, bk.image_url
	, bk.discount
	, bk.isbn
	, bk.sale_link
	, (
		SELECT 
			is_book_favor
		FROM book_favor bf WHERE user_id = 'UI0000000003' and isbn = bk.isbn
	) AS book_favor
FROM book bk
WHERE bk.isbn = '9788965402602';
-- 9788960773417, 9788960773424, 9788960778818, 9788965402602
--     => 0           => 1           =>  0        => NULL
select * from book_favor bf where user_id = 'UI0000000003' and isbn = '9788960773424';
select * from book_favor bf where user_id = 'UI0000000005' limit 10 ;

-- -- 2-2. 코멘트 정보
-- -- -- 2-2-1. 도서 정보 페이지에서의 코멘트 요청
SELECT 
	cm.comment_id AS cm_id
	, cm.comment_content AS cm_content
	, cm.comment_date AS cm_date
	, (
		SELECT ui.nickname
		FROM user_info ui 
		WHERE cm.user_id = ui.user_id 
	) AS nickname
	, (
		SELECT COUNT(cf.comment_id)
		FROM comment_favor cf
		WHERE cf.comment_id = cm.comment_id 
	) AS cm_like_num
	, (
		SELECT cf2.is_comment_favor 
		FROM comment_favor cf2
		WHERE cf2.comment_id = cm.comment_id AND cf2.user_id = 'UI0000000010' 
	) AS is_cm_favor
	, (
		SELECT 1
		FROM comment cm2
		WHERE cm2.user_id = 'UI0000000010' AND cm.comment_id = cm2.comment_id 
	) AS is_writer
	, (
		SELECT 1
		FROM report rp
		WHERE cm.comment_id = rp.comment_id
	) AS is_reported
FROM comment cm
WHERE isbn = '9788960773417'
ORDER BY cm_like_num DESC
LIMIT 0, 10;

SELECT cf2.* 
		FROM comment_favor cf2
		WHERE cf2.comment_id = 'CM0000000001';
SELECT * FROM comment_favor LIMIT 10;
SELECT * FROM report;

-- -- -- 2-2-2. 마이 페이지에서의 코멘트 요청
SELECT 
	cm.comment_id
	, cm.isbn
	, cm.comment_date 
	, bk.image_url 
FROM comment cm
	LEFT JOIN book bk 
	ON cm.isbn = bk.isbn
WHERE user_id = 'UI0000000012';

-- -- 2.3 태그 정보
SELECT
	tg.tag_id
	, tg.tag_name
FROM tag tg
	INNER JOIN book_tag bt 
	on bt.tag_id = tg.tag_id
	INNER JOIN book bk 
	ON bk.isbn = bt.isbn
WHERE bk.isbn = '9788960773417';
SELECT * from book_tag where isbn = '9788960773417';


-- 3. 마이페이지 데이터 조회 쿼리
-- -- 3.1 유저 정보 조회
SELECT 
   ui.user_id
   , ui.nickname
   , ui.intro
   , count(distinct cm.comment_id) comment_cnt
   , sum(cf.is_comment_favor) favor_cnt
from user_info ui
   inner join comment cm 
   on ui.user_id = cm.user_id
   inner join comment_favor cf
   on cm.comment_id = cf.comment_id
where ui.user_id = 'UI0000000003';

-- -- 3.2 유저가 좋아요한 책 목록 조회
SELECT 
	bk.isbn
	, bk.book_title 
	, bk.image_url 
FROM book_favor bf
	INNER JOIN book bk 
	ON bf.isbn = bk.isbn 
where bf.user_id = 'UI0000000010';

SELECT 
-- 	cm.comment_id 
-- 	, cf.is_comment_favor 
   count(distinct cm.comment_id) comment_cnt
   , sum(cf.is_comment_favor) favor_cnt
from user_info ui
   inner join comment cm 
   on ui.user_id = cm.user_id
   inner join comment_favor cf
   on cm.comment_id = cf.comment_id
where ui.user_id = 'UI0000000002';

SELECT 
	cm.comment_id,
	cf.is_comment_favor,
	cf.user_id  
FROM comment cm
	LEFT JOIN comment_favor cf 
	ON cm.comment_id = cf.comment_id 
where cm.user_id = 'UI0000000004'
ORDER BY cf.user_id;

-- 4. 문의 조회
DESC qna;
SELECT * FROM qna;

SELECT 
	qn.
FROM qna qn
WHERE user_id = 'UI0000000005';







