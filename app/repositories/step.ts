'use server';

import { Prisma } from '@prisma/client';
import { prisma as prismaClient } from 'db/db.adapter';

export const createOne = async (
	data: Omit<Prisma.StepCreateInput, 'test'> & { testId: string }
) => {
	const { testId, ...stepData } = data;

	// Find the latest step for this test
	const latestStep = await prismaClient.step.findFirst({
		where: { testId: testId },
		orderBy: { order: 'desc' },
	});

	stepData.order = latestStep ? latestStep.order + 1 : 1;

	return prismaClient.step.create({
		data: {
			...stepData,
			test: { connect: { id: testId } },
		},
	});
};
