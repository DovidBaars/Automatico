'use server';

import { Prisma, Test } from '@prisma/client';
import { prisma as prismaClient } from 'db/db.adapter';
import { TestWithSteps } from 'app/providers/testProvider';

export const getById = (id: string): Promise<TestWithSteps | null> => {
	return prismaClient.test.findUnique({
		where: { id },
		include: {
			steps: {
				orderBy: { order: 'asc' },
				include: { results: true },
			},
		},
	});
};

export const getAllByUserId = (userId: string): Promise<TestWithSteps[]> => {
	console.log('TEST REPO - GET ALL BY USER ID');
	try {
		return prismaClient.test.findMany({
			where: { user: { id: userId } },
			include: { steps: { include: { results: true } } },
		});
	} catch (error) {
		console.error('Error getting tests by user ID:', error);
		throw new Error('Error getting tests by user ID');
	}
};

export const createOne = (
	data: Omit<Prisma.TestCreateInput, 'user'> & { userId: string }
): Promise<Test> => {
	const { userId, ...testData } = data;
	return prismaClient.test.create({
		data: {
			...testData,
			user: { connect: { id: userId } },
		},
		include: { steps: true },
	});
};

// async update(
// 	id: string,
// 	data: Prisma.TestUpdateInput
// ): Promise<TestWithSteps> {
// 	return prismaClient.test.update({
// 		where: { id },
// 		data,
// 		include: { steps: true },
// 	});
// },

export const deleteOne = (id: string): Promise<TestWithSteps> => {
	console.log('TEST REPO - DELETE ONE', id);
	return prismaClient.test.delete({
		where: { id },
		include: { steps: { include: { results: true } } },
	});
};

export const deleteMany = (ids: string[]): Promise<{ count: number }[]> => {
	console.log('TEST REPO - DELETE MANY');
	const deleteSteps = prismaClient.step.deleteMany({
		where: { testId: { in: ids } },
	});
	const deleteResults = prismaClient.result.deleteMany({
		where: { step: { testId: { in: ids } } },
	});
	const deleteTests = prismaClient.test.deleteMany({
		where: { id: { in: ids } },
	});
	return prismaClient.$transaction([deleteSteps, deleteResults, deleteTests]);
};

// async getLatestResultsForTest(testId: string): Promise<Result[]> {
// 	return prismaClient.result.findMany({
// 		where: {
// 			step: {
// 				testId: testId,
// 			},
// 		},
// 		orderBy: {
// 			createdAt: 'desc',
// 		},
// 	});
// },

// async upsertStepResult(
// 	testId: string,
// 	stepData: Omit<Prisma.StepCreateInput, 'test'>
// ): Promise<Step> {
// 	return prismaClient.step.upsert({
// 		where: {
// 			testId_order: {
// 				testId,
// 				order: stepData.order,
// 			},
// 		},
// 		update: stepData,
// 		create: {
// 			...stepData,
// 			test: { connect: { id: testId } },
// 		},
// 	});
// }
