DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `datasets`;
DROP TABLE IF EXISTS `images`;
DROP TABLE IF EXISTS `models`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `token` float NOT NULL,
  `role` enum('users','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `datasets` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `classes` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `images` (
  `id` int(11) NOT NULL,
  `label` varchar(30) NOT NULL,
  `boundingBoxes` varchar(100) DEFAULT NULL,
  `path` varchar(100) NOT NULL,
  `datasetId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `models` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `path` varchar(100) NOT NULL,
  `datasetId` int(11) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `datasets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId1` (`userId`);

ALTER TABLE `images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `datasetId1` (`datasetId`);

ALTER TABLE `models`
  ADD PRIMARY KEY (`id`),
  ADD KEY `datasetId` (`datasetId`),
  ADD KEY `userId` (`userId`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `datasets`
  ADD CONSTRAINT `userId1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

ALTER TABLE `images`
  ADD CONSTRAINT `datasetId1` FOREIGN KEY (`datasetId`) REFERENCES `datasets` (`id`);

ALTER TABLE `models`
  ADD CONSTRAINT `datasetId` FOREIGN KEY (`datasetId`) REFERENCES `datasets` (`id`),
  ADD CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

INSERT INTO `users` (`id`, `email`, `token`, `role`) VALUES
(3, 'admin@admin.it', 100, 'admin'),
(4, 'users1@users1.it', 100000, 'users');

INSERT INTO `datasets` (`id`, `name`, `classes`, `userId`) VALUES
(1, 'occhi_ritagliati', 9, 4),
(2, 'occhio_dx', 3, 4);

INSERT INTO `images` (`id`, `label`, `boundingBoxes`, `path`, `datasetId`) VALUES
(1, 'high_center', NULL, '/paths/imagess/blabla_0.png', 1),
(2, 'high', NULL, '/paths/imagess/blabla_1.png', 2);

INSERT INTO `models` (`id`, `name`, `path`, `datasetId`, `userId`) VALUES
(1, 'my_eye_models_0', '/blabla/my_eye_models_0.zip', 1, 4),
(2, 'my_eye_models_1', '/blabla/my_eye_models_1.zip', 2, 4);