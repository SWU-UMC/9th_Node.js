import { pool } from '../db.config.js';

/**
 * 새로운 가게 정보를 DB에 삽입.
 */
export const createStore = async (name, address, region) => {
    const [result] = await pool.query(
        `INSERT INTO store (name, address, region) VALUES (?, ?, ?)`,
        [name, address, region]
    );
    return result.insertId;
};

/**
 * 가게 ID로 가게 존재 여부를 확인.
 */
export const findStoreById = async (storeId) => {
    const [rows] = await pool.query(`SELECT id FROM store WHERE id = ?`, [storeId]);
    return rows.length > 0;
};

/**
 * 가게의 평균 평점을 업데이트.
 */
export const updateStoreRating = async (storeId) => {
    await pool.query(
        `UPDATE store SET rating = (SELECT AVG(rating) FROM review WHERE store_id = ?) WHERE id = ?`,
        [storeId, storeId]
    );
    // 평점 업데이트는 별도의 반환 값 없이 처리됨.
};