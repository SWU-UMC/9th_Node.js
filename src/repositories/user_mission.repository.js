import { pool } from "../db.config.js";

//유저가 이미 도전했는지 확인
export const findUserByMission = async (user_id, mission_id) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM user_mission WHERE user_id = ? AND mission_id = ?",
            [user_id, mission_id]
        );
        return rows[0] || null;
    } catch (err) {
        console.error("findUserByMission Error: ", err);
        throw err;
    }
};

//도전 중인 미션 생성 (status = 0)
export const createUserMission = async (data) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO user_mission (mission_id, user_id, restaurant_id, status, start_date) VALUES (?, ?, ?, 0, NOW())",
      [data.mission_id, data.user_id, data.restaurant_id]
    );
    // user_mission 테이블의 PK인 completed_id 반환
    return result.insertId; 
  } catch (err) {
    console.error("createUserMission Error:", err);
    throw err;
  }
};

//completed_id로 유저 미션 조회
export const getUserMissionById = async (completedId) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM user_mission WHERE completed_id = ?",
      [completedId]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("getUserMissionById Error:", err);
    throw err;
  }
};