// src/repositories/mission.repository.js
import { pool } from "../db.config.js";

export const addMission = async (missionData) => {
  const conn = await pool.getConnection();

  try {
    // 가게 존재 여부 확인
    const [storeCheck] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM store WHERE id = ?) AS isExist;`,
      [missionData.storeId]
    );
    if (!storeCheck[0].isExist) {
      throw new Error("해당 가게가 존재하지 않습니다.");
    }

    // 미션 등록
    const [result] = await conn.query(
      `INSERT INTO mission (store_id, title, description, point, deadline)
       VALUES (?, ?, ?, ?, ?);`,
      [
        missionData.storeId,
        missionData.title,
        missionData.description,
        missionData.point,
        missionData.deadline,
      ]
    );

    // 등록된 미션 조회
    const [mission] = await conn.query(
      `SELECT * FROM mission WHERE id = ?;`,
      [result.insertId]
    );

    return mission[0];
  } catch (err) {
    throw new Error(`DB 오류: ${err.message}`);
  } finally {
    conn.release();
  }
};