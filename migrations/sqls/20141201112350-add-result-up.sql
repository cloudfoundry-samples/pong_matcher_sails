CREATE TABLE `result` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `matchId` varchar(255) DEFAULT NULL,
    `winner` varchar(255) DEFAULT NULL,
    `loser` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
);
