import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

// Prisma 클라이언트 초기화
let prisma;

try {
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
  });
  
  // Test the connection
  await prisma.$connect();
  console.log('Prisma client connected successfully');
} catch (error) {
  console.error('Error initializing Prisma client:', error);
  process.exit(1);
}

// MySQL 풀 연결 (필요한 경우에만 사용)
let pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  
  // Test the MySQL connection
  const connection = await pool.getConnection();
  connection.release();
  console.log('MySQL pool created successfully');
} catch (error) {
  console.error('Error creating MySQL pool:', error);
  process.exit(1);
}

export { prisma, pool };
