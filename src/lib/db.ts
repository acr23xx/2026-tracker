import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  
  console.log('Creating Prisma client with URL:', url.substring(0, 30) + '...');
  
  const adapter = new PrismaLibSql({
    url,
    authToken,
  });
  
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
