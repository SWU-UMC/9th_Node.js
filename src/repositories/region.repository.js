import { prisma } from "../db.config.js";

export const regionExists = async (regionId) => {
  const count = await prisma.region.count({
    where: { id: BigInt(regionId) },
  });
  return count > 0;
};
