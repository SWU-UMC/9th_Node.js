import { prisma } from "../db.config.js";

export const getFirstUserId = async () => {
  const user = await prisma.user.findFirst({
    select: { id: true },
    orderBy: { id: "asc" },
  });
  return user?.id ?? null;
};
