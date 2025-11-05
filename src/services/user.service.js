import { 
  responseFromUser,
  responseFromReviews,
  responseFromUserMissions,
 } from '../dtos/user.dto.js';
import {
  addUser,
  getUser,
  getUserPreferencesByUserId,
  setPreference,
  getAllUserReviews,
  getAllUserMissions,
} from "../repositories/user.repository.js";

export const userSignUp = async (data) => {
  const joinUserId = await addUser({
    email: data.email,
    name: data.name,
    gender: data.gender,
    birth: data.birth,
    address: data.address,
    detailAddress: data.detailAddress,
    phoneNumber: data.phoneNumber,
  });

  if (joinUserId === null) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  for (const preference of data.preferences) {
    await setPreference(joinUserId, preference);
  }

  const user = await getUser(joinUserId);
  const preferences = await getUserPreferencesByUserId(joinUserId);

  return responseFromUser({ user, preferences });
};

export const listUserReviews = async (userId) => {
  const reviews = await getAllUserReviews(userId);
  return responseFromReviews(reviews);
};

export const listUserMissions = async (userId, cursor) => { 
  console.log(`[Service] Got userId: ${userId}, Got cursor: ${cursor}`);
  const missions = await getAllUserMissions(userId, cursor);
  return responseFromUserMissions(missions);
};