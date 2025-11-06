import { pool } from "../db.config.js";

// 도전 중복 확인
export const existsUserMission = async ({ userId, missionId }) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT EXISTS(
         SELECT 1 FROM user_mission
         WHERE user_id = ? AND mission_id = ?
       ) AS isExist;`,
      [userId, missionId]
    );
    return !!rows[0].isExist;
  } finally {
    conn.release();
  }
};

// 도전 등록 (기본 상태 IN_PROGRESS)
export const addUserMission = async ({ userId, missionId }) => {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      `INSERT INTO user_mission (user_id, mission_id, status, started_at)
       VALUES (?, ?, 'IN_PROGRESS', NOW());`,
      [userId, missionId]
    );

    const [rows] = await conn.query(
      `SELECT user_id, mission_id, status, started_at, completed_at, created_at, updated_at
         FROM user_mission
        WHERE user_id = ? AND mission_id = ?;`,
      [userId, missionId]
    );

    return rows[0];
  } finally {
    conn.release();
  }
};
