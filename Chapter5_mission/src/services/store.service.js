// src/services/store.service.js
import { addStore } from "../repositories/store.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";

export const createStore = async (storeData) => {
  const store = await addStore(storeData);
  return responseFromStore(store);
};