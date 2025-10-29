import { pool } from "../db.config.js";

//특정 유저가 특정 미션을 완료했는지 확인
export const findCompletedMission  = async (user_id, mission_id) => {
    try {
        const [rows] = await pool.query(
           "SELECT * FROM user_mission WHERE user_id = ? AND mission_id = ? AND status = 1",
            [user_id, mission_id]
        );
        return rows[0] || null;
    } catch (err) {
        console.error("findCompletedMission Error: ", err);
        throw err;
    }
}

//해당 미션에 대해 이미 리뷰를 작성했는지 유효성 확인
export const findReviewByMission = async (user_id, mission_id) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM mission_review WHERE user_id = ? AND mission_id = ?",
            [user_id, mission_id]
        );
        return rows[0] || null;
    } catch (err) {
        console.error("findReviewByMission Error: ", err);
        throw err;
    }
};

//리뷰 추가하기
export const createReview = async (data) => {
    try {
        const [result] = await pool.query(
            "INSERT INTO mission_review (mission_id, restaurant_id, user_id, content, rating, photo) VALUES (?, ?, ?, ?, ?, ?)",
            [data.mission_id, data.restaurant_id, data.user_id, data.content, data.rating, data.photo]
        );
        return rows[0] || null;
    } catch (err) {
        console.error("addReview Error: ", err);
        throw err;
    }
};

//ID로 리뷰 조회
export const getReviewById = async (review_id) => {
    try {
        const [rows] = await pool.query(
      "SELECT * FROM mission_review WHERE review_id = ?",
      [review_id]
    );
    return rows[0] || null;
    } catch(err) {
        console.error("getReviewById Error: ", err);
        throw err;
    }
};
