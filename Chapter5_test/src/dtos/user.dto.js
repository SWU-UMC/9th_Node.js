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

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    birth: user.birth,
    address: user.address,
    detailAddress: user.detail_address,
    phoneNumber: user.phone_number,
    createdAt: user.created_at,
    preferences:
      preferences?.map((p) => ({
        id: p.id,
        name: p.name,
        categoryId: p.food_category_id,
      })) || [],
  };
};