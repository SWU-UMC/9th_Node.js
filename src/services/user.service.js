import { pool } from "../db.config.js";
import bcrypt from "bcrypt";
import { responseFromUser } from "../dtos/user.dto.js";
import { getUserPreferencesByUserId } from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  const pwd = (data.password ?? "").toString().trim();
  if (!pwd) throw new Error("비밀번호는 필수입니다.");

  // preferences 정규화
  const prefs = Array.isArray(data.preferences)
    ? data.preferences.map(Number).filter(Number.isFinite)
    : [];

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 0) 카테고리 전부 검증
    for (const categoryId of prefs) {
      const [rows] = await conn.query(
        "SELECT 1 FROM food_category WHERE id = ? LIMIT 1;",
        [categoryId]
      );
      if (!rows.length) {
        throw new Error(`존재하지 않는 카테고리입니다: ${categoryId}`);
      }
    }

    // 1) 이메일 중복 체크
    const [dup] = await conn.query(
      "SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) AS isExistEmail;",
      [data.email]
    );
    if (dup[0].isExistEmail) {
      throw new Error("이미 존재하는 이메일입니다.");
    }

    // 2) 유저 저장
    const passwordHash = await bcrypt.hash(pwd, 10);
    const [ins] = await conn.query(
      `INSERT INTO user (email, name, gender, birth, address, spec_address, password_hash)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.email,
        data.name,
        data.gender,
        data.birth,
        data.address,
        data.detailAddress,
        passwordHash,
      ]
    );
    const userId = ins.insertId;

    // 3) 선호 저장
    for (const categoryId of prefs) {
      await conn.query(
        // created_at/updated_at 기본값이 없다면 NOW()를 명시해도 됨
        `INSERT INTO user_prefer (category_id, user_id) VALUES (?, ?)`,
        [categoryId, userId]
      );
    }

    // 4) 조회 + 커밋
    const [userRows] = await conn.query("SELECT * FROM user WHERE id = ?", [
      userId,
    ]);
    await conn.commit();

    const preferences = await getUserPreferencesByUserId(userId);
    return responseFromUser(userRows[0], preferences);
  } catch (e) {
    await conn.rollback(); // 실패하면 모두 되돌림
    throw e;
  } finally {
    conn.release();
  }
};
