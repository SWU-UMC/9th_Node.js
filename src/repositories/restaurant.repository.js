import {pool} from "../db.config.js";

// 가게 데이터 삽입
export const addRestaurant = async (data) => {
    const conn = await pool.getConnection();
    try {
        const [result] = await pool.query(
        `INSERT INTO restaurant (name, address, detail_address, phone, region_id, food_category_id) VALUES (?, ?, ?, ?, ?, ?);`, // 'phone', 'food_category_id' 추가
        [
            data.name,
            data.address,
            data.detailAddress,
            data.phone,
            data.regionId,
            data.categoryId,
        ]
        );
        return result.insertId;
    } catch (err) {
        throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};

// 가게 정보 얻기
export const getRestaurantById = async (restaurantId) => {
  const conn = await pool.getConnection();
  try {
    // 가게 정보 + 지역 이름 + 카테고리 이름을 JOIN해서 가져옵니다.
    const [restaurant] = await pool.query(
      `SELECT r.*, rg.name AS regionName, fc.name AS categoryName
       FROM restaurant r 
       JOIN region rg ON r.region_id = rg.id 
       LEFT JOIN food_category fc ON r.food_category_id = fc.id 
       WHERE r.id = ?;`, // LEFT JOIN으로 변경 (카테고리가 null일 수도 있으므로)
      restaurantId
    );

    if (restaurant.length == 0) {
      return null;
    }
    return restaurant[0]; // 객체 1개만 반환
  } catch (err) {
    throw new Error(
      `오류가 발생했어요. 요청 파라미터를 확인해주세요. (${err})`
    );
  } finally {
    conn.release();
  }
};