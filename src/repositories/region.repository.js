import { pool } from "../db.config.js";

export const regionExists = async (regionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query(
      "SELECT id FROM region WHERE id = ? LIMIT 1;",
      [regionId]
    );
    return rows.length > 0;
  } finally {
    conn.release();
  }
};
