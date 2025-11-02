export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수 
    name: body.name, // 필수
    gender: body.gender, // 필수
    birth, // 필수
    address: body.address || "", //선택 
    detailAddress: body.detailAddress || "", //선택 
    phoneNumber: body.phoneNumber,//필수
    preferences: body.preferences,// 필수 
  };
};

/**
 * 서비스 계층에서 받아온 사용자 정보를 클라이언트에 반환할 형식으로 변환
 * @param {Object} user - 데이터베이스에서 조회한 사용자 정보
 * @param {Array} categories - 사용자의 선호 카테고리 목록
 * @returns {Object} 클라이언트에 반환할 사용자 정보
 */
export const responseFromUser = (user, categories = []) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    birth: user.birth,
    address: user.address,
    detailAddress: user.detailAddress,
    phoneNumber: user.phoneNumber,
    preferences: categories.map(category => ({
      id: category.id,
      name: category.name,
      // 카테고리 관련 추가 필드가 있다면 여기에 포함시키기
    })),
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
};