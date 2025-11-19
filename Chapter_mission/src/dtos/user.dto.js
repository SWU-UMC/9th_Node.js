// 요청 Body -> DB에 넣을 User 데이터 형태로 변환
export const bodyToUser = (body) => {
  const birth = body.birth ? new Date(body.birth) : null;

  return {
    email: body.email,                // 필수
    password: body.password,          // 필수 (암호화된 상태로 service에서 넘김)
    name: body.name || null,          // 선택
    nickname: body.nickname,          // 필수
    gender: body.gender || "UNKNOWN", // 선택 (기본값)
    birth,                            // 선택
    phoneNumber: body.phoneNumber,    // 필수
    profileImage: body.profileImage || null, // 선택 (URL)
  };
};

// DB에서 조회된 User -> Client 응답 구조로 변환
export const responseFromUser = (user) => {
  if (!user) return null;

  return {
    id: user.id != null ? String(user.id) : null,
    email: user.email,
    name: user.name,
    nickname: user.nickname,
    gender: user.gender,
    birth: user.birth,
    phoneNumber: user.phoneNumber,     // snake -> camel 수정
    profileImage: user.profileImage,   // snake -> camel 수정
    createdAt: user.createdAt,         // snake -> camel 수정
    updatedAt: user.updatedAt,         // snake -> camel 수정
  };
};

