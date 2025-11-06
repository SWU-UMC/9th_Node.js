import { pool } from '../db.config.js';

/**
 * 특정 미션에 도전 중(in_progress)인 레코드가 있는지 확인.
 */
export const findOngoingChallenge = async (userId, missionId) => {
    const [rows] = await pool.query(
        `SELECT id FROM user_challenge WHERE user_id = ? AND mission_id = ? AND status = 'in_progress'`,
        [userId, missionId]
    );
    return rows.length > 0;
};

/**
 * 새로운 미션 도전을 user_challenge 테이블에 추가.
 */
export const createChallenge = async (userId, missionId) => {
    const [result] = await pool.query(
        `INSERT INTO user_challenge (user_id, mission_id) VALUES (?, ?)`,
        [userId, missionId]
    );
    return result.insertId;
};













/*
// userChallenge.repository.js ㅈㅁ

/**
 * 특정 사용자가 특정 미션에 '도전 중' 상태인지 확인합니다.
 * @param {number} userId - 사용자 ID
 * @param {number} missionId - 미션 ID
 * @returns {Promise<boolean>} - 도전 중이면 true, 아니면 false
 */

/*
export const findOngoingChallenge = async (userId, missionId) => {
    // 이미 'in_progress' 상태인 도전이 있는지 조회
    const [rows] = await pool.query(
        `SELECT id FROM user_challenge WHERE user_id = ? AND mission_id = ? AND status = 'in_progress'`,
        [userId, missionId]
    );
    // 행이 하나라도 있으면 이미 도전 중
    return rows.length > 0; 
};
*/