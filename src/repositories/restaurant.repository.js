import { pool } from "../db.config.js";

// 레스토랑 추가
export const addRestaurant = async ({ restaurant_name, restaurant_address, latitude, longitude }) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO restaurant (restaurant_name, restaurant_address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [restaurant_name, restaurant_address, latitude, longitude]
    );
    return result.insertId;
  } catch (err) {
    console.error("addRestaurant Error:", err);
    throw err;
  }
};

// 특정 레스토랑 조회
export const getRestaurantById = async (id) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM restaurant WHERE restaurant_id = ?",
      [id]
    );
    return rows[0] || null;
  } catch (err) {
    console.error("getRestaurantById Error:", err);
    throw err;
  }
};
