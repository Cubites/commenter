use commenter;

show tables;

CREATE DATABASE `commenter` /*!40100 DEFAULT CHARACTER SET latin1 */;

CREATE TABLE `book` (
  `id` int(11) NOT NULL,
  `image_url` varchar(300) DEFAULT NULL,
  `writer` varchar(100) DEFAULT NULL,
  `publisher` varchar(100) DEFAULT NULL,
  `isbn` varchar(50) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `sale_link` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `book_tag` (
  `id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `tag_id` int(11) DEFAULT NULL,
  KEY `fk_book_tag_book` (`book_id`),
  KEY `fk_book_tag_tag` (`tag_id`),
  CONSTRAINT `fk_book_tag_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`),
  CONSTRAINT `fk_book_tag_tag` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `bookmark` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `bookmark_cancel` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_bookmark_user` (`user_id`),
  KEY `fk_bookmark_book` (`book_id`),
  CONSTRAINT `fk_bookmark_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`),
  CONSTRAINT `fk_bookmark_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  `comment_content` text DEFAULT NULL,
  `date` date DEFAULT NULL,
  `report_done` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comment_user` (`user_id`),
  KEY `fk_comment_book` (`book_id`),
  CONSTRAINT `fk_comment_book` FOREIGN KEY (`book_id`) REFERENCES `book` (`id`),
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `favor` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  `favor_cancel` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_favor_comment` (`comment_id`),
  CONSTRAINT `fk_favor_comment` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `report` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `comment_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_report_comment` (`comment_id`),
  CONSTRAINT `fk_report_comment` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `tag` (
  `id` int(11) NOT NULL,
  `tag_name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `intro` text DEFAULT NULL,
  `naver_token` varchar(100) DEFAULT NULL,
  `kakao_token` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
