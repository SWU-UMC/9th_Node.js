export const bodyToUser = (body) => {
  // 생년월일이 유효한지 확인하고, 유효하지 않으면 현재 날짜로 설정
  let birth;
  if (body.birth) {
    // YYYY-MM-DD 형식으로 오는 경우
    if (typeof body.birth === 'string' && body.birth.match(/^\d{4}-\d{2}-\d{2}$/)) {
      birth = new Date(body.birth);
    } 
    // 타임스탬프 형식인 경우
    else if (!isNaN(new Date(parseInt(body.birth)).getTime())) {
      birth = new Date(parseInt(body.birth));
    }
  }
  
  // 여전히 유효하지 않으면 현재 날짜로 설정
  if (!birth || isNaN(birth.getTime())) {
    birth = new Date();
  }

  // 성별 유효성 검사
  const validGenders = ['MALE', 'FEMALE', 'OTHER'];
  const gender = validGenders.includes(body.gender) ? body.gender : 'OTHER';

  // 선호 음식 카테고리 처리 (서비스 레이어에서 ID로 변환됨)
  const preferences = Array.isArray(body.preferences) 
    ? body.preferences
        .map(pref => (typeof pref === 'string' ? pref.trim() : ''))
        .filter(pref => pref)
    : [];

  return {
    email: body.email, // 필수
    password: body.password, // 필수
    name: body.name, // 필수
    gender, // MALE, FEMALE, OTHER
    birth, // YYYY-MM-DD 형식
    address: body.address || "", // 주소
    detailAddress: body.detailAddress || "", // 상세 주소
    phoneNumber: body.phoneNumber || null, // 선택사항 (null 허용)
    preferences // 선호 음식 카테고리 배열
  };
};








export const responseFromUser = ({ user, preferences = [] }) => {
  const preferFoods = preferences.length > 0 
    ? preferences.map((preference) => 
        typeof preference === 'object' ? preference.foodCategory?.name : preference
      )
    : [];

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    birth: user.birth,
    phoneNumber: user.phoneNumber,
    address: user.address,
    detailAddress: user.detailAddress,
    preferCategory: preferFoods,
  };
};








