// src/dtos/store.dto.js

export const bodyToStore = (body, regionId) => {
  return {
    regionId,                  // Path Variable
    categoryId: body.categoryId, // FK (카테고리)
    name: body.name,           // 필수
    address: body.address || null, // 선택
    description: body.description || null, // 선택
  };
};

export const responseFromStore = (store) => {
  if (!store) return null;
  return {
    id: store.id,
    regionId: store.region_id,
    categoryId: store.category_id,
    name: store.name,
    address: store.address,
    description: store.description,
    createdAt: store.created_at,
    updatedAt: store.updated_at,
  };
};