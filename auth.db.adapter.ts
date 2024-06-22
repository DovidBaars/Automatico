import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const neon = new Pool({ connectionString: process.env.POSTGRES_PRISMA_URL });
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });
export const authDbAdapter = PrismaAdapter(prisma);
