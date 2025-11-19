import { PrismaClient } from "@prisma/client";

// Prisma 클라이언트 초기화
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty'
});

export { prisma };
