import { pool } from "../db.config.js";

// 리뷰 데이터 삽입
export const addReview = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query(
      `INSERT INTO review (user_id, restaurant_id, content, rating) VALUES (?, ?, ?, ?);`,
      [data.userId, data.restaurantId, data.content, data.rating]
    );
    return result.insertId; 
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// ID로 리뷰 정보 얻기
export const getReviewById = async (reviewId) => {
  const conn = await pool.getConnection();
  try {
    const [review] = await pool.query(
        `SELECT * FROM review WHERE id = ?;`, 
        reviewId
    );
    if (review.length == 0) {
        return null;
    }
    return review[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};