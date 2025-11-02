import { pool } from "../db.config.js";

export const categoryExists = async (id) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query(
      "SELECT 1 FROM food_category WHERE id = ? LIMIT 1;",
      [id]
    );
    return rows.length > 0;
  } finally {
    conn.release();
  }
};
