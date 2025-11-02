import { pool } from "../db.config.js";

export const getFirstUserId = async () => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query(
      "SELECT id FROM user ORDER BY id ASC LIMIT 1;"
    );
    return rows.length ? rows[0].id : null;
  } finally {
    conn.release();
  }
};
