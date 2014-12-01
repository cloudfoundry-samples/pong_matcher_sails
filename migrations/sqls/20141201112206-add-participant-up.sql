CREATE TABLE `participant` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `matchId` varchar(255) DEFAULT NULL,
    `matchRequestUuid` varchar(255) DEFAULT NULL,
    `playerId` varchar(255) DEFAULT NULL,
    `opponentId` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `matchRequestUuid` (`matchRequestUuid`)
);
