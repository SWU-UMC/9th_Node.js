// src/repositories/region.repository.js
import { prisma } from "../db.config.js";

export const findRegionById = async (regionId) => {
  return await prisma.region.findUnique({
    where: { region_id: Number(regionId) },
  });
};

export const createRestaurant = async (regionId, data) => {
  return await prisma.restaurant.create({
    data: {
      region_id: Number(regionId),
      restaurant_name: data.restaurant_name,
      restaurant_address: data.restaurant_address,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  });
};