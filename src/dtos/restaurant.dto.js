export const bodyToRestaurant = (data) => {
  return {
    name: data.name, // 필수
    address: data.address, // 필수
    detailAddress: data.detailAddress || null,
    phoneNumber: data.phoneNumber || null, 
    regionId: data.regionId, // 필수
    categoryId: data.categoryId || null, 
  };
};


export const responseFromRestaurant = (data) => {
  return {
    id: data.id,
    name: data.name,
    address: data.address,
    detailAddress: data.detail_address,
    phoneNumber: data.phoneNumber,
    regionId: data.regionId,
    regionName: data.region.name, 
    categoryId: data.foodCategoryId,
    categoryName: data.foodCategory.name
  };
};

export const responseFromReviews = (reviews) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};