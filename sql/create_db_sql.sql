CREATE DATABASE commenter /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

use commenter;

CREATE TABLE user (
  user_id int,
  nickname varchar(50),
  intro text,
  n_token varchar(100),
  k_token varchar(100)
  constraint primary key user_pk (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE login_token (
  user_id int,
  access_token varchar(300),
  refresh_token varchar(300),
  refresh_expire datetime,
  constraint primary key login_token_pk (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE guest (
  guest_ip varchar(30),
  comment_count int,
  constraint primary key guest_pk (quest_ip)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comment (
  comment_id int,
  user_id int,
  isbn varchar(30),
  comment_content text,
  comment_date datetime default current_timestamp,
  report_done tinyint(1) default 0,
  constraint primary key comment_pk (comment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book_favor (
  user_id int,
  isbn int,
  bookmark_cancel tinyint(1) default 0,
  constraint primary key book_favor_pk (user_id, isbn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE qna (
  user_id int,
  qna_reason varchar(30),
  qna_content text,
  qna_date datetime(6),
  answer text,
  constraint primary key qna_pk (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book (
  isbn varchar(30),
  book_name varchar(150),
  image_url varchar(300),
  writer varchar(150),
  publisher varchar(100),
  publication date,
  discount int,
  sale_link varchar(300),
  constraint primary key book_pk (isbn)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE comment_favor (
  comment_id int,
  user_id int,
  favor_cancel tinyint(1) default 0,
  constraint primary key comment_favor_pk (comment_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE report (
  comment_id int,
  user_id int,
  report_reason text,
  report_date datetime(6),
  constraint primary key report_pk (comment_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book_tag (
  isbn int,
  tag_id int,
  constraint primary key book_tag_pk (isbn, tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tag (
  tag_id int,
  tag_name varchar(30),
  constraint primary key tag_pk (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;