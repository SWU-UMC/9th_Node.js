import { pool } from "../db.config.js";

// 사용자 생성
export const addUser = async (data) => {
  const conn = await pool.getConnection();

  try {
    // 이메일 중복 확인
    const [confirm] = await pool.query(
      `SELECT EXISTS(SELECT 1 FROM user WHERE email = ?) AS isExistEmail;`,
      [data.email]
    );

    if (confirm[0].isExistEmail) {
      return null; // 이미 존재하는 이메일
    }

    // user 테이블 INSERT문
    const [result] = await pool.query(
      `INSERT INTO user 
       (email, password, name, nickname, birth, phone_number, gender, profile_image)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        data.email,
        data.password,       // 암호화된 비밀번호 저장
        data.name,
        data.nickname,
        data.birth,
        data.phoneNumber,
        data.gender,
        data.profileImage || null,
      ]
    );

    return result.insertId; // 새로 생성된 유저 ID 반환
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  } finally {
    conn.release();
  }
};

// 사용자 정보 조회
export const getUser = async (userId) => {
  const conn = await pool.getConnection();

  try {
    const [user] = await pool.query(`SELECT * FROM user WHERE id = ?;`, [userId]);

    if (user.length === 0) {
      return null;
    }

    return user[0];
  } catch (err) {
    throw new Error(`오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`);
  } finally {
    conn.release();
  }
};
