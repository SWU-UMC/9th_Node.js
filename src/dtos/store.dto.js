import { ValidationError } from "../errors.js";

export const bodyToStore = (body, regionIdFromPath) => {
  const name = (body?.name ?? "").toString().trim();
  const address = (body?.address ?? "").toString().trim();
  const regionId = Number(
    regionIdFromPath ?? body?.regionId ?? body?.region_id
  );

  if (!name) {
    throw new ValidationError("가게 이름(name)은 필수입니다.", {
      name: body?.name,
    });
  }
  if (!Number.isFinite(regionId) || regionId <= 0) {
    throw new ValidationError("regionId는 양의 정수여야 합니다.", {
      regionId: regionIdFromPath ?? body?.regionId ?? body?.region_id,
    });
  }

  return { name, address, regionId };
};

export const responseFromStore = (store) => ({
  id: Number(store.id),
  regionId: Number(store.regionId ?? store.region_id ?? 0),
  name: store.name,
  address: store.address ?? "",
  score: Number(store.score ?? 0),
  createdAt: store.createdAt ?? store.created_at ?? null,
  updatedAt: store.updatedAt ?? store.updated_at ?? null,
});
