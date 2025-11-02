/**
 * 리뷰를 삽입
 */

import { pool } from '../db.config.js';

export const createReview = async (userId, storeId, rating, content) => {
    const [result] = await pool.query(
        `INSERT INTO review (user_id, store_id, rating, content) VALUES (?, ?, ?, ?)`,
        [userId, storeId, rating, content]
    );
    return result.insertId;
};