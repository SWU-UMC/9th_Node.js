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

export const responseFromUser = (data) => {
    const {user, preferences} = data;
    const u = user[0];

    return {
        email: u.email,
        name: u.name,
        gender: u.gender,
        birth: u.birth,
        address: u.address,
        detailAddress: u.detailAddress, 
        phoneNumber: u.phoneNumber,
        preferences: preferences,
    };
};