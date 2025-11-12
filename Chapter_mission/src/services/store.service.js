// src/services/store.service.js
import { addStore,
        findDuplicateStore,
        getRegionById } from "../repositories/store.repository.js";
import { responseFromStore } from "../dtos/store.dto.js";
import { RegionNotFoundError, DuplicateStoreError } from "../error.js";

// 가게 등록
export const createStore = async (storeData) => {
  // region 존재 확인
  const region  = await getRegionById(storeData.regionId);
  if (!region) {
    throw new RegionNotFoundError("해당 지역이 존재하지 않습니다.");
  }

  //  가게 중복 확인
  const duplicateStore = await findDuplicateStore(storeData.regionId, storeData.name);
  if (duplicateStore) {
    throw new DuplicateStoreError("이미 등록된 가게입니다.");
  }

  const store = await addStore(storeData);
  return responseFromStore(store);
};