-- ===============================
-- DATABASE INITIALIZATION
-- ===============================
CREATE DATABASE IF NOT EXISTS umc_9th CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE umc_9th_mission;

-- ===============================
-- USER TABLES
-- ===============================

CREATE TABLE user (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password        VARCHAR(255) NOT NULL,
  name            VARCHAR(100),
  birth           DATE,
  phone_number    VARCHAR(20),
  gender          ENUM('MALE', 'FEMALE', 'OTHER', 'UNKNOWN') DEFAULT 'UNKNOWN',
  nickname        VARCHAR(255),
  inactive_date   DATETIME(6),
  created_at      DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at      DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  profile_image   VARCHAR(255)
);

-- ===============================
-- SOCIAL ACCOUNT TABLE
-- ===============================

CREATE TABLE social_account (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  provider        ENUM('KAKAO', 'NAVER', 'GOOGLE', 'APPLE') NOT NULL,
  provider_id     BIGINT,
  last_login      DATETIME,
  refresh_token   VARCHAR(512),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- ===============================
-- TERMS & USER CONSENT
-- ===============================

CREATE TABLE terms (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(255) NOT NULL,
  is_required     BOOLEAN DEFAULT FALSE,
  created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);

CREATE TABLE user_consent (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  terms_id        BIGINT NOT NULL,
  consent         BOOLEAN DEFAULT FALSE,
  consent_at      DATETIME(6),
  revoke_at       DATETIME(6),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (terms_id) REFERENCES terms(id) ON DELETE CASCADE
);

-- ===============================
-- CATEGORY & USER FAVOR CATEGORY
-- ===============================

CREATE TABLE category (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(255) NOT NULL
);

CREATE TABLE user_favor_category (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  category_id     BIGINT NOT NULL,
  created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
  UNIQUE (user_id, category_id)
);

-- ===============================
-- REGION & STORE
-- ===============================

CREATE TABLE region (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  goal_count      INT DEFAULT 0,
  reward_point    INT DEFAULT 0,
  created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);

CREATE TABLE store (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  region_id       BIGINT,
  category_id     BIGINT,
  name            VARCHAR(255) NOT NULL,
  address         VARCHAR(255),
  description     VARCHAR(255),
  created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

-- ===============================
-- MISSION & USER_MISSION
-- ===============================

CREATE TABLE mission (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  title           VARCHAR(100) NOT NULL,
  description     TEXT,
  point           INT NOT NULL DEFAULT 0,
  deadline        DATETIME,
  created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  store_id        BIGINT,
  FOREIGN KEY (store_id) REFERENCES store(id) ON DELETE CASCADE
);

CREATE TABLE user_mission (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  mission_id      BIGINT NOT NULL,
  status          ENUM('IN_PROGRESS','COMPLETED','FAILED') DEFAULT 'IN_PROGRESS',
  created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (mission_id) REFERENCES mission(id) ON DELETE CASCADE,
  UNIQUE (user_id, mission_id)
);

-- ===============================
-- POINT (미션별 포인트 로그)
-- ===============================

CREATE TABLE point (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_mission_id BIGINT NOT NULL,
  point_balance   INT NOT NULL,
  created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  FOREIGN KEY (user_mission_id) REFERENCES user_mission(id) ON DELETE CASCADE
);

-- ===============================
-- INQUIRY & INQUIRY ANSWER
-- ===============================

CREATE TABLE inquiry (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT NOT NULL,
  title           VARCHAR(255) NOT NULL,
  category        ENUM('SERVICE','ACCOUNT','BUG','OTHER') NOT NULL,
  content         TEXT NOT NULL,
  created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE inquiry_answer (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  inquiry_id      BIGINT UNIQUE NOT NULL,
  admin_id        BIGINT NOT NULL,
  content         VARCHAR(255),
  created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  FOREIGN KEY (inquiry_id) REFERENCES inquiry(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES user(id) ON DELETE CASCADE
);

-- ===============================
-- REVIEW & REVIEW IMAGE
-- ===============================

CREATE TABLE review (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_mission_id BIGINT NOT NULL,
  body            TEXT,
  score           INT CHECK (score BETWEEN 1 AND 5),
  image_count     INT DEFAULT 0,
  created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  updated_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  FOREIGN KEY (user_mission_id) REFERENCES user_mission(id) ON DELETE CASCADE
);

CREATE TABLE review_image (
  id              BIGINT AUTO_INCREMENT PRIMARY KEY,
  review_id       BIGINT NOT NULL,
  image_url       TEXT NOT NULL,
  created_at      DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE
);

-- ===============================
-- INDEXES (주요 FK 테이블만)
-- ===============================

CREATE INDEX idx_user_mission_user ON user_mission(user_id);
CREATE INDEX idx_user_mission_mission ON user_mission(mission_id);
CREATE INDEX idx_point_user_mission ON point(user_mission_id);
CREATE INDEX idx_review_user_mission ON review(user_mission_id);
CREATE INDEX idx_store_region ON store(region_id);
CREATE INDEX idx_store_category ON store(category_id);
CREATE INDEX idx_user_favor_category_user ON user_favor_category(user_id);
CREATE INDEX idx_user_favor_category_category ON user_favor_category(category_id);
CREATE INDEX idx_inquiry_user ON inquiry(user_id);
CREATE INDEX idx_inquiry_answer_admin ON inquiry_answer(admin_id);

