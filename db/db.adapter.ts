import { PrismaAdapter as PrismaAuthAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { Pool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';

const generatePrismaClient = () => {
	const neon = new Pool({
		connectionString: process.env.POSTGRES_PRISMA_URL,
	});
	const adapter = new PrismaNeon(neon);
	return new PrismaClient({ adapter });
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || generatePrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const authDbAdapter = PrismaAuthAdapter(prisma);
