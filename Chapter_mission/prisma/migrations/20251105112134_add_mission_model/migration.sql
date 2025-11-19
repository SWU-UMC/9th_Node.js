/*
  Warnings:

  - You are about to drop the column `category_id` on the `user_favor_category` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_favor_category` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,categoryId]` on the table `user_favor_category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `user_favor_category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `user_favor_category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_favor_category` DROP FOREIGN KEY `user_favor_category_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_favor_category` DROP FOREIGN KEY `user_favor_category_user_id_fkey`;

-- DropIndex
DROP INDEX `user_favor_category_category_id_fkey` ON `user_favor_category`;

-- DropIndex
DROP INDEX `user_favor_category_user_id_fkey` ON `user_favor_category`;

-- AlterTable
ALTER TABLE `category` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `user_favor_category` DROP COLUMN `category_id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `categoryId` BIGINT NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` BIGINT NOT NULL;

-- CreateTable
CREATE TABLE `social_account` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `provider` ENUM('KAKAO', 'NAVER', 'GOOGLE', 'APPLE') NOT NULL,
    `providerId` BIGINT NULL,
    `last_login` DATETIME(3) NULL,
    `refresh_token` VARCHAR(512) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `terms` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `is_required` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_consent` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `termsId` BIGINT NOT NULL,
    `consent` BOOLEAN NULL DEFAULT false,
    `consent_at` DATETIME(3) NULL,
    `revoke_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `region` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `goal_count` INTEGER NOT NULL DEFAULT 0,
    `reward_point` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `regionId` BIGINT NULL,
    `categoryId` BIGINT NULL,
    `name` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mission` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `point` INTEGER NOT NULL DEFAULT 0,
    `deadline` DATETIME(3) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `storeId` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_mission` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `missionId` BIGINT NOT NULL,
    `status` ENUM('IN_PROGRESS', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'IN_PROGRESS',
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_mission_userId_missionId_key`(`userId`, `missionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `point` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_mission_id` BIGINT NOT NULL,
    `point_balance` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiry` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userId` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `category` ENUM('SERVICE', 'ACCOUNT', 'BUG', 'OTHER') NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inquiry_answer` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `inquiryId` BIGINT NOT NULL,
    `adminId` BIGINT NOT NULL,
    `content` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `inquiry_answer_inquiryId_key`(`inquiryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_mission_id` BIGINT NOT NULL,
    `body` TEXT NULL,
    `score` INTEGER NULL,
    `image_count` INTEGER NULL DEFAULT 0,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_image` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `reviewId` BIGINT NOT NULL,
    `image_url` TEXT NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_favor_category_userId_categoryId_key` ON `user_favor_category`(`userId`, `categoryId`);

-- AddForeignKey
ALTER TABLE `user_favor_category` ADD CONSTRAINT `user_favor_category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_favor_category` ADD CONSTRAINT `user_favor_category_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `social_account` ADD CONSTRAINT `social_account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_consent` ADD CONSTRAINT `user_consent_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_consent` ADD CONSTRAINT `user_consent_termsId_fkey` FOREIGN KEY (`termsId`) REFERENCES `terms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store` ADD CONSTRAINT `store_regionId_fkey` FOREIGN KEY (`regionId`) REFERENCES `region`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `store` ADD CONSTRAINT `store_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mission` ADD CONSTRAINT `mission_storeId_fkey` FOREIGN KEY (`storeId`) REFERENCES `store`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_mission` ADD CONSTRAINT `user_mission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_mission` ADD CONSTRAINT `user_mission_missionId_fkey` FOREIGN KEY (`missionId`) REFERENCES `mission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `point` ADD CONSTRAINT `point_user_mission_id_fkey` FOREIGN KEY (`user_mission_id`) REFERENCES `user_mission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry` ADD CONSTRAINT `inquiry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry_answer` ADD CONSTRAINT `inquiry_answer_inquiryId_fkey` FOREIGN KEY (`inquiryId`) REFERENCES `inquiry`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inquiry_answer` ADD CONSTRAINT `inquiry_answer_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `review_user_mission_id_fkey` FOREIGN KEY (`user_mission_id`) REFERENCES `user_mission`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_image` ADD CONSTRAINT `review_image_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
