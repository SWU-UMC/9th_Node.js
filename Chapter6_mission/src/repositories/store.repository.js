// src/repositories/store.repository.js
import { pool } from "../db.config.js";

export const addStore = async (storeData) => {
  const conn = await pool.getConnection();

  try {
    // 지역 존재 여부 확인
    const [regionCheck] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM region WHERE id = ?) AS isExist;`,
      [storeData.regionId]
    );
    if (!regionCheck[0].isExist) {
      throw new Error("해당 지역이 존재하지 않습니다.");
    }

    // 중복 이름 방지 (같은 지역 내)
    const [dupCheck] = await conn.query(
      `SELECT EXISTS(SELECT 1 FROM store WHERE name = ? AND region_id = ?) AS isExist;`,
      [storeData.name, storeData.regionId]
    );
    if (dupCheck[0].isExist) {
      throw new Error("이미 동일한 이름의 가게가 존재합니다.");
    }

    // 데이터 삽입
    const [result] = await conn.query(
      `INSERT INTO store (region_id, category_id, name, address, description)
       VALUES (?, ?, ?, ?, ?);`,
      [
        storeData.regionId,
        storeData.categoryId,
        storeData.name,
        storeData.address,
        storeData.description,
      ]
    );

    // 삽입된 데이터 조회
    const [store] = await conn.query(`SELECT * FROM store WHERE id = ?;`, [
      result.insertId,
    ]);

    return store[0];
  } catch (err) {
    throw new Error(`DB 오류: ${err.message}`);
  } finally {
    conn.release();
  }
};