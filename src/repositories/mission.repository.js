import { pool } from "../db.config.js";

// 미션 데이터 삽입
export const addMission = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query(
      `INSERT INTO mission (restaurant_id, point, content, deadline) VALUES (?, ?, ?, ?);`,
      [data.restaurantId, data.point, data.content, data.deadline]
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

// ID로 미션 정보 얻기
export const getMissionById = async (missionId) => {
  const conn = await pool.getConnection();
  try {
    const [mission] = await pool.query(
        `SELECT * FROM mission WHERE id = ?;`, 
        missionId
    );
    if (mission.length == 0) {
        return null;
    }
    return mission[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자가 특정 미션에 도전 중인지 확인 (검증용)
export const checkUserMissionExists = async (userId, missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query(
      `SELECT * FROM user_mission WHERE user_id = ? AND mission_id = ?;`,
      [userId, missionId]
    );
    return rows.length > 0;
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 사용자가 미션에 도전
export const addUserMission = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query(
      `INSERT INTO user_mission (user_id, mission_id) VALUES (?, ?);`,
      [data.userId, data.missionId]
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

// ID로 user_mission 정보 조회 (방금 추가한 '도전' 확인용)
export const getUserMissionById = async (userMissionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query(
      `SELECT * FROM user_mission WHERE id = ?;`,
      userMissionId
    );
    if (rows.length == 0) {
      return null;
    }
    return rows[0];
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};