CREATE TABLE `matchrequest` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `uuid` varchar(255) DEFAULT NULL,
    `requesterId` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`)
);
