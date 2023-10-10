use commenter;

-- db, table 조회
show tables;

-- Mariadb 연결 상태 조회
show variables like 'max_connections';

show status like 'Threads_connected';
show full processlist;

show variables like '%timeout%';

set GLOBAL interactive_timeout = 180;
set global wait_timeout = 180;

show status like 'Threads_connected';

-- 시간 조회
SELECT now();