import { pool } from '../db.config.js';

/**
 * 새로운 미션 정보를 DB에 삽입
 */
export const createMission = async (storeId, content, reward, deadline) => {
    const [result] = await pool.query(
        `INSERT INTO mission (store_id, content, reward, deadline) VALUES (?, ?, ?, ?)`,
        [storeId, content, reward, deadline]
    );
    return result.insertId;
};











// src/repositories/mission.repository.cjs
/*
const pool = require('../db.config.js');

// 특정 사용자의 미션 목록 조회
exports.getMissionsByStatus = async (userId, status) => {
    const conn = await pool.getConnection();
    try {
        let query;
        const params = [userId];

        // user_mission 테이블에 status 컬럼이 있다고 가정
        if (status === 'in_progress') {
            query = 'SELECT * FROM user_mission WHERE user_id = ? AND status = "in_progress"';
        } else if (status === 'completed') {
            query = 'SELECT * FROM user_mission WHERE user_id = ? AND status = "completed"';
        } else {
            return []; // 유효하지 않은 status
        }

        const [rows] = await conn.query(query, params);
        return rows;
    } finally {
        conn.release();
    }
};

// 미션 성공 상태 업데이트
exports.updateMissionSuccess = async (userId, missionId) => {
    const conn = await pool.getConnection();
    try {
        // user_mission 테이블의 mission_id가 missionId인 레코드의 status를 'completed'로 업데이트
        const query = 'UPDATE user_mission SET status = "completed" WHERE user_id = ? AND mission_id = ? AND status = "in_progress"';
        const [result] = await conn.query(query, [userId, missionId]);
        return result.affectedRows;
    } finally {
        conn.release();
    }
};

// 완료된 미션에 리뷰 추가 (1-2번 미션과 유사)
exports.insertReviewForMission = async (userId, missionId, reviewData) => {
    const conn = await pool.getConnection();
    try {
        // reviews 테이블에 저장
        const query = `
            INSERT INTO review (user_id, mission_id, rating, content)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await conn.query(query, [
            userId, 
            missionId, 
            reviewData.rating, 
            reviewData.content
        ]);
        return result.insertId;
    } finally {
        conn.release();
    }
};

// (미션 요구사항 1-4번 관련) 도전 중인 미션인지 확인
exports.checkIfMissionIsChallenging = async (userId, missionId) => {
    const conn = await pool.getConnection();
    try {
        const query = 'SELECT id FROM user_mission WHERE user_id = ? AND mission_id = ? AND status = "in_progress"';
        const [rows] = await conn.query(query, [userId, missionId]);
        return rows.length > 0;
    } finally {
        conn.release();
    }
};

// (미션 요구사항 1-4번 관련) 미션 도전 시작
exports.startMissionChallenge = async (userId, missionId) => {
    const conn = await pool.getConnection();
    try {
        // status를 'in_progress'로 설정하여 저장
        const query = 'INSERT INTO user_mission (user_id, mission_id, status) VALUES (?, ?, "in_progress")';
        const [result] = await conn.query(query, [userId, missionId]);
        return result.insertId;
    } finally {
        conn.release();
    }
};
*/