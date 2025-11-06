import * as storeRepository from '../repositories/store.repository.js';

/**
 * 가게 추가 비즈니스 로직. (단순 삽입)
 */
export const addNewStore = async (storeData) => {
    // 필요 시 여기에 가게 이름 중복 검증 등의 로직을 추가
    
    const storeId = await storeRepository.createStore(
        storeData.name, 
        storeData.address, 
        storeData.region
    );
    
    return { storeId: storeId, message: '가게가 성공적으로 추가되었습니다.' };
};