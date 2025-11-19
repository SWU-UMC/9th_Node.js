// 요청 본문 → User 객체로 변환
export const bodyToUser = (body) => {
  const birth = new Date(body.birth); 

  return {
    email: body.email, 
    name: body.name, 
    gender: body.gender, 
    birth, 
    address: body.address || "", 
    detailAddress: body.detailAddress || "", 
    phoneNumber: body.phoneNumber, 
    preferences: body.preferences, 
  };
};

// 워크북 응답 dto
export const responseFromUser = ({ user, preferences }) => {
  const preferFoods = preferences.map(
    (preference) => preference.foodCategory.name
  );

  return {
    email: user.email,
    name: user.name,
    preferCategory: preferFoods,
  };
};





/*export const bodyToUser = (body) => {
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
  }; 워크북 실습*/