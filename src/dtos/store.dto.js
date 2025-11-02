export const bodyToStore = (body, regionIdFromPath) => ({
  name: body.name,
  address: body.address || "",
  regionId: Number(regionIdFromPath ?? body.regionId),
});

export const responseFromStore = (store) => ({
  id: store.id,
  regionId: store.region_id,
  name: store.name,
  address: store.address,
  score: store.score,
  createdAt: store.created_at,
  updatedAt: store.updated_at,
});
