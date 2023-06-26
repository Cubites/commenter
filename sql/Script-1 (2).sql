use commenter;

-- db, table, 데이터 조회
show tables;
desc user;
desc login_token;
desc book;
desc comment;

-- 테이블 초기화
DELETE from user;
DELETE from login_token;
DELETE FROM comment;

select * from user;
select * from login_token;
select * from book;
select * from comment;

select isbn, book_title, author, image_url from book where book_title like '%javascript%' order by publication desc limit 10;

-- 데이터 추가 테스트
INSERT user (user_id, n_token) values(10, '12400');

insert login_token (user_id, access_token, refresh_token, refresh_expire)
	values(
		10, 
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidXNlciIsImlhdCI6MTY2MDYzMjg3NywiZXhwIjoxNjYwNjMyODg3fQ.whJuSHMJQGCT3fqyK_DtIn1FjxDvWYskPqNXsId44js', 
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6ImV5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUp5YjJ4bElqb2lkWE5sY2lJc0ltbGhkQ0k2TVRZMk1EWXpNamczTnl3aVpYaHdJam94TmpZd05qTXlPRGczZlEud2hKdVNITUpRR0NUM2ZxeUtfRHRJbjFGanhEdldZc2tQcU5Yc0lkNDRqcyIsImV4cGlyZSI6MTY2MDY0MzY3Nzk0NCwiaWF0IjoxNjYwNjMyODc3fQ.WlWnHKUBbvU8R3dlR1DI-Fs0dLK1VkHY5nSxvb_LmVM',
		1660643677944);
delete from login_token where user_id = 10;

insert comment (comment_id, user_id, isbn, comment_content, comment_date) 
	values (1, 1, '9791158392239', '좋은책입니다.6', DATE_FORMAT('2022-08-29 10:24:12.456', '%Y-%m-%d %H:%i:%s.%m'));



-- db, table 변경사항
alter table login_token modify refresh_token varchar(500);
alter table login_token modify refresh_expire bigint;
alter table book change writer author varchar(500);
ALTER TABLE comment MODIFY COLUMN comment_date datetime default null;
alter table comment modify comment_date datetime(6);



-- 조회 관련 쿼리
desc book;

-- 테이블 삭제, 생성
drop table bookmark;
select * from comment where comment_id = 30;

SELECT now();


