-- CreateTable
CREATE TABLE `mission` (
    `mission_id` INTEGER NOT NULL AUTO_INCREMENT,
    `restaurant_id` INTEGER NOT NULL,
    `mission_title` VARCHAR(100) NOT NULL,
    `mission_detail` TEXT NULL,
    `reward_point` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `restaurant_id`(`restaurant_id`),
    PRIMARY KEY (`mission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mission_review` (
    `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    `mission_id` INTEGER NOT NULL,
    `restaurant_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `content` TEXT NULL,
    `rating` FLOAT NULL,
    `photo` VARCHAR(255) NULL,
    `owner_reply` TEXT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `mission_id`(`mission_id`),
    INDEX `restaurant_id`(`restaurant_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `point` (
    `point_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `point_value` INTEGER NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`point_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `region` (
    `region_id` INTEGER NOT NULL AUTO_INCREMENT,
    `region_name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`region_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `restaurant` (
    `restaurant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `region_id` INTEGER NOT NULL,
    `restaurant_name` VARCHAR(100) NOT NULL,
    `restaurant_address` VARCHAR(255) NULL,
    `latitude` DECIMAL(10, 7) NULL,
    `longitude` DECIMAL(10, 7) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `region_id`(`region_id`),
    PRIMARY KEY (`restaurant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NULL,
    `name` VARCHAR(100) NOT NULL,
    `nickname` VARCHAR(50) NULL,
    `birth` DATE NULL,
    `phone_number` VARCHAR(20) NULL,
    `status` VARCHAR(20) NULL,
    `gender` ENUM('M', 'F', 'N') NULL DEFAULT 'N',
    `inactive_at` DATETIME(0) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `profile_image` VARCHAR(255) NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_mission` (
    `user_mission_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `mission_id` INTEGER NOT NULL,
    `status` ENUM('in_progress', 'completed') NULL DEFAULT 'in_progress',
    `started_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `completed_at` DATETIME(0) NULL,

    INDEX `mission_id`(`mission_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`user_mission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mission` ADD CONSTRAINT `mission_ibfk_1` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`restaurant_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `mission_review` ADD CONSTRAINT `mission_review_ibfk_1` FOREIGN KEY (`mission_id`) REFERENCES `mission`(`mission_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `mission_review` ADD CONSTRAINT `mission_review_ibfk_2` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurant`(`restaurant_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `mission_review` ADD CONSTRAINT `mission_review_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `point` ADD CONSTRAINT `point_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `restaurant` ADD CONSTRAINT `restaurant_ibfk_1` FOREIGN KEY (`region_id`) REFERENCES `region`(`region_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_mission` ADD CONSTRAINT `user_mission_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_mission` ADD CONSTRAINT `user_mission_ibfk_2` FOREIGN KEY (`mission_id`) REFERENCES `mission`(`mission_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
