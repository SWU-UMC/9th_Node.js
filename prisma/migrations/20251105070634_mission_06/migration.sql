-- CreateTable
CREATE TABLE `Restaurant` (
    `restaurant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `restaurant_name` VARCHAR(191) NOT NULL,
    `restaurant_address` VARCHAR(191) NOT NULL,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`restaurant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mission` (
    `mission_id` INTEGER NOT NULL AUTO_INCREMENT,
    `restaurant_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `reward` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`mission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User_mission` (
    `user_mission_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `mission_id` INTEGER NOT NULL,
    `completed_id` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `start_date` DATETIME(3) NULL,
    `end_date` DATETIME(3) NULL,

    PRIMARY KEY (`user_mission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mission_review` (
    `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    `mission_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `restaurant_id` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `photo` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Mission` ADD CONSTRAINT `Mission_restaurant_id_fkey` FOREIGN KEY (`restaurant_id`) REFERENCES `Restaurant`(`restaurant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_mission` ADD CONSTRAINT `User_mission_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User_mission` ADD CONSTRAINT `User_mission_mission_id_fkey` FOREIGN KEY (`mission_id`) REFERENCES `Mission`(`mission_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mission_review` ADD CONSTRAINT `Mission_review_mission_id_fkey` FOREIGN KEY (`mission_id`) REFERENCES `Mission`(`mission_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mission_review` ADD CONSTRAINT `Mission_review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Mission_review` ADD CONSTRAINT `Mission_review_restaurant_id_fkey` FOREIGN KEY (`restaurant_id`) REFERENCES `Restaurant`(`restaurant_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
