import { prisma } from "../db.config.js";

export const categoryExists = async (id) => {
  const count = await prisma.foodCategory.count({ where: { id: Number(id) } });
  return count > 0;
};
