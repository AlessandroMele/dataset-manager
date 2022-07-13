DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `datasets`;
DROP TABLE IF EXISTS `images`;
DROP TABLE IF EXISTS `models`;

CREATE TABLE `users` (
  `username` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL UNIQUE,
  `password` varchar(256) NOT NULL,
  `token` float NOT NULL DEFAULT 100,
  `role` enum('user','admin') NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `datasets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `classes` int(11) NOT NULL,
  `user` varchar(30) NOT NULL,
  `deletedAt` DATETIME DEFAULT NULL,
  `createdAt` DATETIME DEFAULT NULL,
  `updatedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user`) REFERENCES `users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(30) DEFAULT NULL,
  `boundingBoxes` varchar(100) DEFAULT NULL,
  `path` varchar(100) NOT NULL,
  `datasetId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`datasetId`) REFERENCES `datasets` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `models` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `path` varchar(100) DEFAULT NULL UNIQUE,
  `datasetId` int(11) NOT NULL,
  `user` varchar(30) NOT NULL,
  `deletedAt` DATETIME DEFAULT NULL,
  `createdAt` DATETIME DEFAULT NULL,
  `updatedAt` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`datasetId`) REFERENCES `datasets` (`id`),
  FOREIGN KEY (`user`) REFERENCES `users` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `users`(`email`, `username`, `token`,`password`, `role`) VALUES
('admin@admin.it','admin', 100, 'password1', 'admin'),
('users1@users1.it', 'user', 100000, 'password2', 'user');

INSERT INTO `datasets` (`id`, `name`, `classes`, `user`) VALUES
(1, 'occhi_ritagliati', 9, 'user'),
(2, 'occhio_dx', 3, 'user');

INSERT INTO `images` (`id`, `label`, `boundingBoxes`, `path`, `datasetId`) VALUES
(1, 'high_center', NULL, '/paths/imagess/blabla_0.png', 1),
(2, 'high', NULL, '/paths/imagess/blabla_1.png', 2);

INSERT INTO `models` (`id`, `name`, `path`, `datasetId`, `user`) VALUES
(1, 'my_eye_models_0', '/blabla/my_eye_models_0.zip', 1, 'user'),
(2, 'my_eye_models_1', '/blabla/my_eye_models_1.zip', 2, 'user');