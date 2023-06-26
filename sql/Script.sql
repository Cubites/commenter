use commenter;

-- db, table 조회
show tables;
desc user;
desc login_token;

-- 테이블 데이터 초기화
DELETE from user;
DELETE from login_token;

SELECT * FROM user;
SELECT * FROM login_token;
SELECT * FROM book;

-- 테이블 데이터 추가
INSERT user (user_id, n_toeken) values (10, '12400');
UPDATE user set n_token = '12401' where user_id = 10;
update login_token set access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjYxMjYyMTg3LCJleHAiOjE2NjEyNjIxOTd9.iLcrsFSIQtI0L0yHzFepw91tT50-w7DfM7njyDPFdHE'
	where user_id = 2;

INSERT login_token (user_id, access_token, refresh_token, refresh_expire)
	values (
		10,
		'asregawryg',
		'aerwgwarge',
		1660644677944
	);
DELETE from login_token where user_id = 10;
DELETE FROM book WHERE book_title like "%알고리즘%";

-- 테이블 컬럼 수정
alter table user change n_token n_token varchar(1000);
alter table user change k_token k_token varchar(1000);

alter table login_token change user_id user_id int;

-- Mariadb 연결 상태 조회
show variables like 'max_connections';

show status like 'Threads_connected';
show full processlist;

show variables like '%timeout%';

set GLOBAL interactive_timeout = 180;
set global wait_timeout = 180;



select * from book where isbn = '12513513';

show status like 'Threads_connected';

