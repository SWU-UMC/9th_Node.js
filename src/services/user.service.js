import { responseFromUser } from "../dtos/user.dto.js";
import { DuplicateUserEmailError, UnauthorizedError } from "../errors.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';

import {
  addUser,
  getUser,
  updateUser,
  updateUserPreferences,
  getUserPreferencesByUserId,
  setPreference,
} from "../repositories/user.repository.js";

const JWT_SECRET = process.env.JWT_SECRET;
export const userSignUp = async (data) => {

  const hashedPassword = await bcrypt.hash(data.password, 10); // 10은 salt rounds
  
  const joinUserId = await addUser({
    email: data.email,
    password: hashedPassword,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
  }


  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  const accessToken = jwt.sign(
        { id: user.id, email: user.email, gender: user.gender, birth: user.birth, address: user.address }, // Payload: 사용자 ID와 이메일
        JWT_SECRET,
        { expiresIn: '1h' } // 만료 시간 1시간 설정
    );

  return responseFromUser({ user, preferences, token: accessToken });
};

export const userUpdateInfo = async (userId, data) => {
  const { preferences, ...updateData } = data;
  const updatedUser = await updateUser(userId, updateData);

  if (!updatedUser) {
        throw new UnauthorizedError("사용자를 찾을 수 없거나 업데이트할 데이터가 유효하지 않습니다.");
  }

  //선호 카테고리 갱신하기
  if (preferences && preferences.length > 0) {
    await updateUserPreferences(userId, preferences)
  }

    const finalPreferences = await getUserPreferencesByUserId(userId);
    return responseFromUser({ user: updatedUser, preferences: finalPreferences });
};