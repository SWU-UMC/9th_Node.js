// src/repositories/userMission.repository.js
import { pool } from "../db.config.js";

// 이미 도전 중인지 확인
export const findActiveChallenge = async (userId, missionId) => {
  const [rows] = await pool.query(
    `SELECT * FROM user_mission 
     WHERE user_id = ? AND mission_id = ? AND status = 'IN_PROGRESS';`,
    [userId, missionId]
  );
  return rows[0];
};

// 도전 시작
export const addUserMission = async (userId, missionId) => {
  const [result] = await pool.query(
    `INSERT INTO user_mission (user_id, mission_id, status)
     VALUES (?, ?, 'IN_PROGRESS');`,
    [userId, missionId]
  );
  return result.insertId;
};

// 생성된 도전 정보 조회
export const getUserMissionById = async (id) => {
  const [rows] = await pool.query(`SELECT * FROM user_mission WHERE id = ?;`, [id]);
  return rows[0];
};