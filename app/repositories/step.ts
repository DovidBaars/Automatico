'use server';

import { Prisma } from '@prisma/client';
import { prisma as prismaClient } from 'db/db.adapter';

export const createOne = (
	data: Omit<Prisma.StepCreateInput, 'test'> & { testId: string }
) => {
	const { testId, ...stepData } = data;
	return prismaClient.step.create({
		data: {
			...stepData,
			test: { connect: { id: testId } },
		},
	});
};
