export const bodyToUser = (body) => {
  const birth = new Date(body.birth); //날짜 변환

  return {
    email: body.email, //필수
    name: body.name, // 필수
    gender: body.gender === "여성" ? 0 : 1, // 필수
    birth, // 필수
    address: body.address || "", //선택
    specAddress: body.detailAddress || "", //선택
    password: body.password, //필수
    preferences: Array.isArray(body.preferences)
      ? body.preferences.map(Number).filter(Number.isFinite)
      : [],
  };
};

export const responseFromUser = ({ user, preferences }) => {
  const preferFoods = (preferences ?? []).map((pref) => pref.category?.name);

  return {
    email: user.email,
    name: user.name,
    preferCategory: preferFoods,
  };
};
