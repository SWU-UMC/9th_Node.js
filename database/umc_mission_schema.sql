-- 스키마 선택
USE umc_mission;

-- [안전 실행용] FK 체크 잠시 해제
SET FOREIGN_KEY_CHECKS = 0;

-- 기존 테이블이 있다면 삭제
DROP TABLE IF EXISTS review_image;
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS user_mission;
DROP TABLE IF EXISTS social_account;
DROP TABLE IF EXISTS user_consent;
DROP TABLE IF EXISTS terms;
DROP TABLE IF EXISTS mission;
DROP TABLE IF EXISTS store;
DROP TABLE IF EXISTS region;
DROP TABLE IF EXISTS faq;
DROP TABLE IF EXISTS point;
DROP TABLE IF EXISTS user;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================
-- 1) 사용자
-- =========================
CREATE TABLE user (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  email          VARCHAR(320) NOT NULL UNIQUE,
  password       VARCHAR(255) NOT NULL,             -- 해시 저장
  name           VARCHAR(30)  NULL,                 -- 실명
  nickname       VARCHAR(30)  NOT NULL,
  birth          DATE         NULL,
  phone_number   VARCHAR(13)  NULL,
  status         ENUM('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
  gender         ENUM('MALE','FEMALE','OTHER','UNKNOWN') DEFAULT 'UNKNOWN',
  inactive_at    DATETIME(6)  NULL,
  created_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  profile_image  VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- 2) 소셜 계정 연동
-- =========================
CREATE TABLE social_account (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id       BIGINT      NOT NULL,
  provider      ENUM('KAKAO','NAVER','GOOGLE','APPLE','GITHUB','OTHER') NOT NULL,
  provider_id   VARCHAR(191) NOT NULL,          -- 소셜 식별자
  last_login    DATETIME(6)  NULL,
  refresh_token VARCHAR(255) NULL,
  UNIQUE KEY uq_social_provider (provider, provider_id),
  KEY idx_social_user (user_id),
  CONSTRAINT fk_social_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- 3) 약관(문서) / 동의 이력
-- =========================
CREATE TABLE terms (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  code        ENUM('TOS','PRIVACY','LOCATION','MARKETING','AGE14') NOT NULL,
  is_required BOOLEAN      NOT NULL DEFAULT 0,
  version     INT          NOT NULL DEFAULT 1,
  content_url VARCHAR(255) NULL,
  effective_at DATETIME(6) NULL,
  created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_terms (code, version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_consent (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT     NOT NULL,
  terms_id     BIGINT     NOT NULL,
  consent      BOOLEAN    NOT NULL DEFAULT 1,     -- 동의(1)/거부(0)
  consent_at   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  revoked_at   DATETIME(6) NULL,
  KEY idx_consent_user (user_id),
  KEY idx_consent_terms (terms_id),
  CONSTRAINT fk_consent_user
    FOREIGN KEY (user_id)  REFERENCES user(id)   ON DELETE CASCADE,
  CONSTRAINT fk_consent_terms
    FOREIGN KEY (terms_id) REFERENCES terms(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- 4) 지역
-- =========================
CREATE TABLE region (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(320) NOT NULL,
  post_count  INT          NOT NULL DEFAULT 0,
  reward_point INT         NOT NULL DEFAULT 0,
  created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- 5) 가게(스토어)
-- =========================
CREATE TABLE store (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  region_id   BIGINT       NOT NULL,
  name        VARCHAR(120) NOT NULL,
  address     VARCHAR(255) NULL,
  description TEXT         NULL,
  avg_score   DECIMAL(3,2) NULL,
  created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  KEY idx_store_region (region_id),
  CONSTRAINT fk_store_region
    FOREIGN KEY (region_id) REFERENCES region(id)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- 6) 미션
-- =========================
CREATE TABLE mission (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  store_id    BIGINT       NULL,                 -- 특정 가게 연계 미션이면 사용
  region_id   BIGINT       NULL,                 -- 지역 단위 미션이면 사용
  title       VARCHAR(1000) NOT NULL,
  description TEXT         NULL,
  point       INT          NOT NULL,
  deadline    DATETIME(6)  NULL,
  created_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  KEY idx_mission_store (store_id),
  KEY idx_mission_region (region_id),
  CONSTRAINT fk_mission_store
    FOREIGN KEY (store_id)  REFERENCES store(id)   ON DELETE SET NULL,
  CONSTRAINT fk_mission_region
    FOREIGN KEY (region_id) REFERENCES region(id)  ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- 7) 사용자-미션 매핑
-- =========================
CREATE TABLE user_mission (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT      NOT NULL,
  mission_id  BIGINT      NOT NULL,
  status      ENUM('ONGOING','COMPLETED','CANCELED') NOT NULL DEFAULT 'ONGOING',
  created_at  DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  UNIQUE KEY uq_user_mission (user_id, mission_id),
  KEY idx_um_user   (user_id),
  KEY idx_um_mission(mission_id),
  CONSTRAINT fk_um_user
    FOREIGN KEY (user_id)   REFERENCES user(id)    ON DELETE CASCADE,
  CONSTRAINT fk_um_mission
    FOREIGN KEY (mission_id) REFERENCES mission(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- 8) 리뷰
-- =========================
CREATE TABLE review (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT      NOT NULL,
  store_id     BIGINT      NOT NULL,
  region_id    BIGINT      NULL,
  body         TEXT        NULL,
  score        INT         NOT NULL,             -- 1~5 등 정책에 맞게
  image_count  INT         NOT NULL DEFAULT 0,
  created_at   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  KEY idx_review_user  (user_id),
  KEY idx_review_store (store_id),
  KEY idx_review_region(region_id),
  CONSTRAINT fk_review_user
    FOREIGN KEY (user_id)  REFERENCES user(id)   ON DELETE CASCADE,
  CONSTRAINT fk_review_store
    FOREIGN KEY (store_id) REFERENCES store(id)  ON DELETE CASCADE,
  CONSTRAINT fk_review_region
    FOREIGN KEY (region_id) REFERENCES region(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- 9) 리뷰 이미지
-- =========================
CREATE TABLE review_image (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  review_id   BIGINT      NOT NULL,
  image_url   VARCHAR(255) NOT NULL,
  created_at  DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at  DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  KEY idx_review_image_review (review_id),
  CONSTRAINT fk_review_image_review
    FOREIGN KEY (review_id) REFERENCES review(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- 10) 포인트
-- =========================
CREATE TABLE point (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT     NOT NULL UNIQUE,
  total       INT        NOT NULL DEFAULT 0,
  updated_at  DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_point_user
    FOREIGN KEY (user_id) REFERENCES user(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================
-- 11) FAQ
-- =========================
CREATE TABLE faq (sys_config
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(320) NOT NULL,
  category      ENUM('GENERAL','MISSION','POINT','ACCOUNT','OTHER') NOT NULL DEFAULT 'GENERAL',
  content       TEXT         NOT NULL,user
  image_url     VARCHAR(255) NULL,
  reply_content TEXT         NULL,
  created_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
