export const bodyToRestaurant = (body) => {
  return {
    name: body.name, // 필수
    address: body.address, // 필수
    detailAddress: body.detailAddress || null,
    phone: body.phone || null, 
    regionId: body.regionId, // 필수
    categoryId: body.categoryId || null, 
  };
};


export const responseFromRestaurant = (data) => {
  return {
    id: data.id,
    name: data.name,
    address: data.address,
    detailAddress: data.detail_address,
    phone: data.phone,
    regionId: data.region_id,
    regionName: data.regionName, 
    categoryId: data.food_category_id,
    categoryName: data.categoryName, 
    createdAt: data.created_at,
  };
};