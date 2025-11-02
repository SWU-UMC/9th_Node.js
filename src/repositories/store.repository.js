import { pool } from "../db.config.js";

export const createStoreInDB = async (data) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(
      `INSERT INTO store (region_id, name, address, score)
       VALUES (?, ?, ?, 0);`,
      [data.region_id, data.name, data.address]
    );
    return result.insertId;
  } finally {
    conn.release();
  }
};

export const getStoreById = async (storeId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query("SELECT * FROM store WHERE id = ?;", [
      storeId,
    ]);
    return rows[0] || null;
  } finally {
    conn.release();
  }
};
