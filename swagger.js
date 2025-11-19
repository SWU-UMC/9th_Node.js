// swagger.js
import { fileURLToPath } from "url";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Swagger 옵션 설정
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "UMC 9th API",
      version: "1.0.0",
      description: "UMC 9th Node.js 감자 테스트 프로젝트입니다.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
  },

  // JSDoc이 들어 있는 파일들
  apis: ["./src/controllers/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;