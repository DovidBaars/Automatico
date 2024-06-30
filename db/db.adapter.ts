import { PrismaAdapter as PrismaAuthAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
const adapter = new PrismaNeon(neon);
export const prismaClient = new PrismaClient({ adapter });
export const authDbAdapter = PrismaAuthAdapter(prismaClient);
