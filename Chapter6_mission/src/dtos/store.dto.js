// src/dtos/store.dto.js

export const bodyToStore = (body, regionId) => {
  return {
    regionId,
    categoryId: body.categoryId,
    name: body.name,
    address: body.address || null,
    description: body.description || null,
  };
};

export const responseFromStore = (store) => {
  if (!store) return null;

  return {
    id: store.id,
    regionId: store.regionId,
    categoryId: store.categoryId,
    name: store.name,
    address: store.address,
    description: store.description,
    createdAt: store.createdAt,
    updatedAt: store.updatedAt,
  };
};