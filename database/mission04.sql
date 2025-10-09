-- 1. User (사용자)
CREATE TABLE User (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    gender ENUM('M', 'F', 'O') NOT NULL,
    birth DATE,
    address VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME
);

-- 2. Restaurant (음식점)
CREATE TABLE Restaurant (
    restaurant_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_name VARCHAR(50) NOT NULL,
    restaurant_address VARCHAR(150),
    latitude FLOAT,
    longitude FLOAT
);

-- 3. Mission (미션)
CREATE TABLE Mission (
    mission_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id BIGINT,
    title VARCHAR(100),
    description VARCHAR(200),
    reward INT,
    FOREIGN KEY (restaurant_id) REFERENCES Restaurant(restaurant_id)
);

-- 4. Food (음식)
CREATE TABLE Food (
    food_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    food_name VARCHAR(100) NOT NULL
);
