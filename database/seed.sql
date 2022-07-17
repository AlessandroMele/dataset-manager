DROP TABLE IF EXISTS `models`;
DROP TABLE IF EXISTS `images`;
DROP TABLE IF EXISTS `labels`;
DROP TABLE IF EXISTS `keywords`;
DROP TABLE IF EXISTS `datasets`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `username` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL UNIQUE,
  `password` varchar(256) NOT NULL,
  `token` DECIMAL(8,3) NOT NULL DEFAULT 100,
  `role` enum('user', 'admin') NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE `datasets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `classes` int(11) NOT NULL,
  `user` varchar(30) NOT NULL,
  `deleted` BIT DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user`) REFERENCES `users` (`username`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(100) NOT NULL UNIQUE,
  `dataset` int(11) NOT NULL,
  `deleted` BIT DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`dataset`) REFERENCES `datasets` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE `labels` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image` int(11) DEFAULT NULL,
  `label` varchar(30) DEFAULT NULL,
  `center` DECIMAL(7,6),
  `width` DECIMAL(7,6),
  `height` DECIMAL(7,6),
  `deleted` BIT DEFAULT 0,
  FOREIGN KEY (`image`) REFERENCES `images` (`id`),
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE `models` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `path` varchar(100) DEFAULT NULL UNIQUE,
  `dataset` int(11) NOT NULL,
  `user` varchar(30) NOT NULL,
  `deleted` BIT DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`dataset`) REFERENCES `datasets` (`id`),
  FOREIGN KEY (`user`) REFERENCES `users` (`username`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE `keywords` (
  `keyword` varchar(30) NOT NULL,
  `deleted` BIT DEFAULT 0,
  `dataset` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`keyword`,`dataset`),
  FOREIGN KEY (`dataset`) REFERENCES `datasets` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

INSERT INTO `users`(`email`, `username`, `token`, `password`, `role`)
VALUES (
    'admin@admin.it',
    'admin',
    100,
    'password1',
    'admin'
  ),
  (
    'users1@users1.it',
    'user',
    100000,
    'password2',
    'user'
  );

INSERT INTO `datasets` (`id`, `name`, `classes`, `user`)
VALUES 
(1, 'occhi_ritagliati', 9, 'user'),
(2, 'occhio_dx', 3, 'user');

INSERT INTO `keywords`(`keyword`, `dataset`)
VALUES 
('occhio', 1), ('occhi', 2);

INSERT INTO `images` (`id`, `path`, `dataset`)
VALUES 
(1, '/datasets/1/user/img_1.png', 1),
(2, '/datasets/2/user/img_2.png', 2);

INSERT INTO `labels` (`label`, `image`, `center`, `height`, `width`)
VALUES 
('occhi', 1,  0, 0.2, 0.4),
('occhio', 1, 0.4, 0.5, 0.6);

INSERT INTO `models` (`id`, `name`, `path`, `dataset`, `user`)
VALUES (
    1,
    'my_eye_models_0',
    'models/user/1/my_eye_models_0.js',
    1,
    'user'
  ),
  (
    2,
    'my_eye_models_1',
    'models/user/1/my_eye_models_1.py',
    2,
    'user'
  );