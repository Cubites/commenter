-- 설정값 조회 및 변경;

-- db 연결 수 조회
show status like 'Threads_connected';
show full processlist;

-- MariaDB 버전 확인
select version();

-- DB 시간대 조회 및 변경
SHOW VARIABLES LIKE 'time_zone';
SHOW GLOBAL VARIABLES LIKE 'time_zone';

SET time_zone = 'Asia/Seoul';
SET GLOBAL time_zone = 'Asia/Seoul'; -- AWS RDS는 변경 불가, 홈페이지에서 파라미터 변경 기능 사용;

-- 시간대 테스트
create table tt(
	testtime DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

desc tt;

insert tt values (now());

select * from tt;

drop table tt;