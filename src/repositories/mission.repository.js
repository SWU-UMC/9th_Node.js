import { pool } from "../db.config.js";

export const addMission = async ({
  storeId,
  reward,
  deadline,
  missionSpec,
}) => {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query(
      "INSERT INTO mission (store_id, reward, deadline, mission_spec) VALUES (?, ?, ?, ?);",
      [storeId, reward, deadline, missionSpec]
    );
    const [rows] = await pool.query("SELECT * FROM mission WHERE id = ?;", [
      result.insertId,
    ]);
    return rows[0];
  } finally {
    conn.release();
  }
};

export const getMissionById = async (missionId) => {
  const conn = await pool.getConnection();
  try {
    const [rows] = await pool.query("SELECT * FROM mission WHERE id = ?;", [
      missionId,
    ]);
    return rows[0] || null;
  } finally {
    conn.release();
  }
};
