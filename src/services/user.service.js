import { responseFromUser } from "../dtos/user.dto.js";
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

// 음식 카테고리 매핑 (user.dto.js와 동일하게 유지)
const FOOD_CATEGORIES = {
  '한식': 1,
  '일식': 2,
  '중식': 3,
  '양식': 4,
  '치킨': 5,
  '분식': 6,
  '고기/구이': 7,
  '도시락': 8,
  '야식': 9,
  '패스트푸드': 10,
  '디저트': 11,
  '아시안푸드': 12
};

export const userSignUp = async (data) => {
  // 사용자 정보 등록
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  // 선호 카테고리 등록
  if (Array.isArray(data.preferences)) {
    for (const prefName of data.preferences) {
      // 카테고리 이름을 ID로 변환
      const categoryId = FOOD_CATEGORIES[prefName];
      if (categoryId) {
        await setPreference(joinUserId, categoryId);
      }
    }
  }

  // 등록된 사용자 정보와 선호 카테고리 조회
  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};