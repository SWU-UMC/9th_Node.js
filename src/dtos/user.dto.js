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

export const responseFromUser = (user, preferences) => {
  if (!user) return null;

  const userData = Array.isArray(user) ? user[0] : user;

  const formattedPreferences = preferences?.map((pref) => ({
    id: pref.food_category_id,
    name: pref.name,
  })) || [];

  return {
    id: userData.id,
    email: userData.email,
    name: userData.name,
    gender: userData.gender,
    birth: userData.birth,
    address: userData.address,
    detailAddress: userData.detail_address,
    phoneNumber: userData.phone_number,
    createdAt: userData.created_at,
    updatedAt: userData.updated_at,
    preferences: formattedPreferences,
  };
};
