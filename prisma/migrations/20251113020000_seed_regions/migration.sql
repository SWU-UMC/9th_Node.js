-- Add default regions
INSERT INTO `region` (`name`, `created_at`, `updated_at`) 
VALUES 
('서울특별시', NOW(), NOW()),
('부산광역시', NOW(), NOW()),
('대구광역시', NOW(), NOW()),
('인천광역시', NOW(), NOW()),
('광주광역시', NOW(), NOW()),
('대전광역시', NOW(), NOW()),
('울산광역시', NOW(), NOW()),
('세종특별자치시', NOW(), NOW()),
('경기도', NOW(), NOW()),
('강원도', NOW(), NOW()),
('충청북도', NOW(), NOW()),
('충청남도', NOW(), NOW()),
('전라북도', NOW(), NOW()),
('전라남도', NOW(), NOW()),
('경상북도', NOW(), NOW()),
('경상남도', NOW(), NOW()),
('제주특별자치도', NOW(), NOW());

-- Update existing stores with Seoul as default region
UPDATE `store` SET `region_id` = (SELECT id FROM `region` WHERE `name` = '서울특별시' LIMIT 1) WHERE `region_id` IS NULL;

-- Update existing missions with their store's region
UPDATE `mission` m
JOIN `store` s ON m.store_id = s.id
SET m.region_id = s.region_id
WHERE m.region_id IS NULL;
