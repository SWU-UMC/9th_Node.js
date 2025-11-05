import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
  output: {
    client: "./node_modules/.prisma/client", // 기본 경로로 설정
  },
});

//환경 변수 불러올 수 있도록 수정.