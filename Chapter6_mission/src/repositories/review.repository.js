// src/repositories/review.repository.js
import { prisma, pool } from "../db.config.js";

// 리뷰 등록
export const addReview = async (reviewData) => {
  const conn = await pool.getConnection();

  try {
    // 가게 존재 확인
    const [storeCheck] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM store WHERE id = ?) AS isExist;`,
      [reviewData.storeId]
    );
    if (!storeCheck[0].isExist) {
      throw new Error("해당 가게가 존재하지 않습니다.");
    }

    // 미션 존재 확인
    const [missionCheck] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM user_mission WHERE id = ?) AS isExist;`,
      [reviewData.userMissionId]
    );
    if (!missionCheck[0].isExist) {
      throw new Error("해당 미션이 존재하지 않습니다.");
    }

    // 중복 리뷰 방지 (한 미션당 한 리뷰만 가능)
    const [dupCheck] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM review WHERE user_mission_id = ?) AS isExist;`,
      [reviewData.userMissionId]
    );
    if (dupCheck[0].isExist) {
      throw new Error("이미 이 미션에 대한 리뷰가 존재합니다.");
    }

    // 리뷰 등록
    const [result] = await conn.query(
      `INSERT INTO review (user_mission_id, body, score, image_count)
       VALUES (?, ?, ?, ?);`,
      [
        reviewData.userMissionId,
        reviewData.body,
        reviewData.score,
        reviewData.imageCount,
      ]
    );

    // 등록된 리뷰 조회
    const [review] = await conn.query(
      `SELECT * FROM review WHERE id = ?;`,
      [result.insertId]
    );

    return review[0];
  } catch (err) {
    throw new Error(`DB 오류: ${err.message}`);
  } finally {
    conn.release();
  }
};

// 리뷰 조회
export const getAllStoreReviews = async (storeId, cursor) => {
  const reviews = await prisma.review.findMany({
    where: {
      userMission: {
        mission: {
          storeId: storeId,
        },
      },
      id: cursor ? { gt: cursor } : undefined,
    },
    include: {
      userMission: {
        include: {
          user: {
            select: {
              id: true,
              nickname: true,
              profileImage: true,
            },
          },
        },
      },
    },
    orderBy: { id: "asc" },
    take: 5,  // 한 번에 5개 리뷰 반환
  });

  return reviews;
};

// 내가 작성한 리뷰 목록 조회
export const getUserReviews = async (userId, cursor) => {
  const reviews = await prisma.review.findMany({
    where: {
      userMission: {
        userId: userId,
      },
      id: cursor ? { gt: cursor } : undefined,
    },
    include: {
      userMission: {
        include: {
          mission: {
            include: {
              store: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};