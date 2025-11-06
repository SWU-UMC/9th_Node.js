import {pool} from "../db.config.js";

export const addMission = async (data) => {
    try {
        const [result] = await pool.query(
            "INSERT INTO mission (restaurant_id, title, description, reward) VALUES (?, ?, ?, ?)",
            [data.restaurant_id, data.title, data.description, data.reward]
        );
        return result.insertId;
  } catch (err) {
    console.error("addMission Error:", err);
    throw err;
  }
    };

//ID로 특정 미션 조회하기
export const getMissionById = async (mission_id) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM mission WHERE mission_id = ?",
            [mission_id]
        );
        return rows[0] || null;
     } catch (err) {
        console.error("getMissionById Error: ", err);
        throw err;
     }
}