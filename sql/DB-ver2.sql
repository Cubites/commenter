CREATE TABLE user (
  user_id int(11) PRIMARY KEY,
  nickname varchar(50),
  intro text,
  n_token varchar(1000),
  k_token varchar(1000),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE login_token (
  user_id int(11) PRIMARY KEY,
  access_token varchar(300),
  refresh_token varchar(500),
  refresh_expire bigint(20),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE guest (
  guest_ip varchar(30) PRIMARY KEY,
  comment_count int(11),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book (
  isbn varchar(30) PRIMARY KEY,
  book_title varchar(500),
  image_url varchar(300),
  author varchar(500),
  publisher varchar(100),
  publication date,
  discount int(11),
  sale_link varchar(300),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE table book_favor(
	user_id int,
	isbn varchar(30),
	bookmark_cancel tinyint(1),
	PRIMARY KEY (user_id, isbn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book_tag (
  isbn varchar(30),
  tag_id int(11),
  PRIMARY KEY (isbn, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tag (
  tag_id int(11) PRIMARY KEY,
  tag_name varchar(30)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comment (
  comment_id int(11) PRIMARY KEY,
  user_id int(11),
  isbn varchar(30),
  comment_content text,
  comment_date datetime(6),
  report_done tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comment_favor (
  comment_id int(11) PRIMARY KEY,
  user_id int(11),
  favor_cancel tinyint(1) DEFAULT 0,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE report (
  comment_id int(11) PRIMARY,
  user_id int(11),
  report_reason text,
  report_date datetime(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE qna (
  user_id int(11) PRIMARY KEY,
  qna_reason varchar(30),
  qna_content text,
  qna_date datetime(6),
  answer text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;