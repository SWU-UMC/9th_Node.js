export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수
    name: body.name, // 필수
    gender: body.gender === "여성" ? 0 : 1, // 필수
    birth, // 필수
    address: body.address || "", //선택
    detailAddress: body.detailAddress || "", //선택
    password: body.password, //필수
    preferences: Array.isArray(body.preferences)
      ? body.preferences.map(Number).filter(Number.isFinite)
      : [],
  };
};

export const responseFromUser = (user, preferences) => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    gender: user.gender,
    birth: user.birth,
    address: user.address,
    detailAddress: user.detail_address,
    phoneNumber: user.phone_number,
    preferences: preferences || [],
  };
};
