DROP DATABASE commenter;

CREATE DATABASE commenter;

use commenter;

CREATE TABLE user_info (
	user_id varchar(50),
	nickname varchar(50),
	intro text,
	n_token varchar(1000),
	k_token varchar(1000),
	CONSTRAINT PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE login_token (
	user_id varchar(50),
	access_token varchar(300),
	refresh_token varchar(500),
	refresh_expire bigint(20),
	CONSTRAINT PRIMARY KEY (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE guest (
	guest_ip varchar(30),
	comment_count int,
	CONSTRAINT PRIMARY KEY (guest_ip)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book (
	isbn varchar(30),
	book_title varchar(500),
	image_url varchar(300),
	author varchar(500),
	publisher varchar(100),
	publication date,
	discount int,
	sale_link varchar(300),
	CONSTRAINT PRIMARY KEY (isbn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book_favor (
	user_id varchar(50),
	isbn varchar(30),
	is_book_favor tinyint(1),
	CONSTRAINT PRIMARY KEY (user_id, isbn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book_tag (
  isbn varchar(30),
  tag_id varchar(50),
  CONSTRAINT PRIMARY KEY (isbn, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tag (
	tag_id varchar(50),
	tag_name varchar(30),
	constraint primary key (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comment (
  comment_id varchar(50),
  user_id varchar(50),
  guest_ip varchar(30),
  isbn varchar(30),
  comment_content text,
  comment_date datetime,
  report_done tinyint(1),
  CONSTRAINT PRIMARY KEY (comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comment_favor (
  comment_id varchar(50),
  user_id varchar(50),
  is_comment_favor tinyint(1),
  CONSTRAINT PRIMARY KEY (comment_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE report (
  comment_id varchar(50),
  user_id varchar(50),
  report_reason text,
  report_date datetime,
  CONSTRAINT PRIMARY KEY (comment_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE qna (
  qna_id varchar(50),
  user_id varchar(50),
  qna_reason varchar(30),
  qna_content text,
  qna_date datetime,
  answer text,
  CONSTRAINT PRIMARY KEY (qna_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

