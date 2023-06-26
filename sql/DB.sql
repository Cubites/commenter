create database commenter;

use commenter;

CREATE table guest (
	id int Primary key,
	ip varchar(30),
	comment_count int
);

CREATE table user(
	id int Primary key,
	nickname varchar(50),
	intro text,
	naver_token varchar(100),
	kakao_token varchar(100),
	login_token varchar(100)
);

CREATE table book(
	id int Primary Key,
	image_url varchar(300),
	writer varchar(100),
	publisher varchar(100),
	isbn varchar(50),
	price int,
	sale_link varchar(300)
);

CREATE table comment(
	id int Primary Key,
	user_id int,
	book_id int,
	comment_content text,
	date date,
	report_done tinyint(1),
	constraint fk_comment_book foreign key (book_id) references book(id)
);

CREATE table bookmark(
	id int primary key,
	user_id int,
	book_id int,
	bookmark_cancel tinyint(1),
	constraint fk_bookmark_user foreign key (user_id) references user(id),
	constraint fk_bookmark_book foreign key (book_id) references book(id)
);


CREATE table qna(
	id int Primary key,
	user_id int,
	intro text,
	reason varchar(30),
	content text,
	date date,
	answer text,
	constraint fk_qna_user foreign key (user_id) references user(id)
);

CREATE table report(
	id int primary key,
	user_id int,
	comment_id int,
	reason text,
	date date,
	constraint fk_report_comment Foreign Key (comment_id) references comment(id)
);

CREATE table favor(
	id int primary key,
	user_id int,
	comment_id int,
	favor_cancel tinyint(1),
	constraint fk_favor_comment foreign key (comment_id) references comment(id)
);

CREATE table tag(
	id int primary key,
	tag_name varchar(30)
);

CREATE table book_tag(
	id int,
	book_id int,
	tag_id int,
	constraint fk_book_tag_book foreign key (book_id) references book(id),
	constraint fk_book_tag_tag foreign key (tag_id) references tag(id)
);

CREATE table login_token(
	id int primary key,
	user_id varchar(100),
	access_token varchar(300),
	refresh_token varchar(300),
	refresh_expire Date
);