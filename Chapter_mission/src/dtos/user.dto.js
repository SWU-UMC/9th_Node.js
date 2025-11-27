// 회원가입 요청 Body -> DB 저장용 데이터 변환 + 검증
export const bodyToUser = (body) => {
  // 필수값 검증
  if (!body.email || typeof body.email !== "string") {
    throw new Error("email은 필수이며 문자열이어야 합니다.");
  }

  if (!body.password || typeof body.password !== "string") {
    throw new Error("password는 필수이며 문자열이어야 합니다.");
  }

  if (!body.nickname || typeof body.nickname !== "string") {
    throw new Error("nickname은 필수이며 문자열이어야 합니다.");
  }

  if (!body.phoneNumber || typeof body.phoneNumber !== "string") {
    throw new Error("phoneNumber는 필수이며 문자열이어야 합니다.");
  }

  // 선택값 검증
  if (body.birth !== undefined && body.birth !== null) {
    const birthDate = new Date(body.birth);
    if (Number.isNaN(birthDate.getTime())) {
      throw new Error("birth는 YYYY-MM-DD 형식의 유효한 날짜여야 합니다.");
    }
  }

  if (body.gender !== undefined && !["MALE", "FEMALE", "UNKNOWN"].includes(body.gender)) {
    throw new Error("gender는 MALE, FEMALE, UNKNOWN 중 하나여야 합니다.");
  }

  if (body.profileImage !== undefined && typeof body.profileImage !== "string") {
    throw new Error("profileImage는 문자열(URL)이어야 합니다.");
  }

  return {
    email: body.email,
    password: body.password, // 암호화는 service에서 처리
    name: body.name || null,
    nickname: body.nickname,
    gender: body.gender || "UNKNOWN",
    birth: body.birth ? new Date(body.birth) : null,
    phoneNumber: body.phoneNumber,
    profileImage: body.profileImage || null,
  };
};


// DB User -> 응답용 구조 변환
export const responseFromUser = (user) => {
  if (!user) return null;

  return {
    id: user.id != null ? String(user.id) : null,
    email: user.email,
    name: user.name,
    nickname: user.nickname,
    gender: user.gender,
    birth: user.birth,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};


// 사용자 정보 부분 수정용 DTO: PATCH /users/me
export const bodyToUserUpdate = (body) => {
  const updateData = {};

  // name (선택, 비어 있지 않은 문자열)
  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim().length === 0) {
      throw new Error("name은 비어있지 않은 문자열이어야 합니다.");
    }
    updateData.name = body.name.trim();
  }

  // nickname (선택, 비어 있지 않은 문자열)
  if (body.nickname !== undefined) {
    if (typeof body.nickname !== "string" || body.nickname.trim().length === 0) {
      throw new Error("nickname은 비어있지 않은 문자열이어야 합니다.");
    }
    updateData.nickname = body.nickname.trim();
  }

  // phoneNumber (선택, 비어 있지 않은 문자열)
  if (body.phoneNumber !== undefined) {
    if (typeof body.phoneNumber !== "string" || body.phoneNumber.trim().length === 0) {
      throw new Error("phoneNumber는 비어있지 않은 문자열이어야 합니다.");
    }
    updateData.phoneNumber = body.phoneNumber.trim();
  }

  // birth (선택, 날짜 형식 검증)
  if (body.birth !== undefined && body.birth !== null) {
    const birthDate = new Date(body.birth);
    if (Number.isNaN(birthDate.getTime())) {
      throw new Error("birth는 YYYY-MM-DD 형식의 유효한 날짜여야 합니다.");
    }

    updateData.birth = body.birth;
  }

  // gender (선택, 지정된 값만 허용)
  if (body.gender !== undefined) {
    if (!["MALE", "FEMALE", "UNKNOWN"].includes(body.gender)) {
      throw new Error("gender는 MALE, FEMALE, UNKNOWN 중 하나여야 합니다.");
    }
    updateData.gender = body.gender;
  }

  // profileImage (선택, 문자열이어야 함)
  if (body.profileImage !== undefined) {
    if (typeof body.profileImage !== "string") {
      throw new Error("profileImage는 문자열(URL)이어야 합니다.");
    }
    updateData.profileImage = body.profileImage;
  }

  // 실제로 수정할 필드가 하나도 없으면 에러
  if (Object.keys(updateData).length === 0) {
    throw new Error("수정할 정보가 없습니다. 최소 한 개 이상의 필드를 보내야 합니다.");
  }

  return updateData;
};