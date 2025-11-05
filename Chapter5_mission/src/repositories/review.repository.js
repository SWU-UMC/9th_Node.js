// src/repositories/review.repository.js
import { pool } from "../db.config.js";

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
