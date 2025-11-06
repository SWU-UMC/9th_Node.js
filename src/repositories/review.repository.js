import { pool } from "../db.config.js";

export const addReview = async ({ score, body, userId, storeId }) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query(
      `INSERT INTO review (score, body, user_id, store_id) VALUES (?, ?, ?, ?);`,
      [score, body, userId, storeId]
    );
    const [rows] = await pool.query(`SELECT * FROM review WHERE id = ?;`, [
      result.insertId,
    ]);
    return rows[0];
  } finally {
    conn.release();
  }
};
