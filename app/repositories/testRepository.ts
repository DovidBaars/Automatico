'use server';

import { Prisma, Test, Step, Result } from '@prisma/client';
import { prismaClient } from '../../db/db.adapter';
import { ResultArg } from '@prisma/client/runtime/library';

type TestWithSteps = Test & { steps: Step[] };

// async getById(id: string): Promise<TestWithSteps | null> {
// 	return prismaClient.test.findUnique({
// 		where: { id },
// 		include: {
// 			steps: {
// 				orderBy: { order: 'asc' },
// 			},
// 		},
// 	});
// },

export const getAllByUserId = async (
	userId: string
): Promise<TestWithSteps[]> => {
	console.log('TEST REPO - GET ALL BY USER ID');
	try {
		return prismaClient.test.findMany({
			where: { user: { id: userId } },
			include: { steps: true },
		});
	} catch (error) {
		console.error('Error getting tests by user ID:', error);
		throw new Error('Error getting tests by user ID');
	}
};

// async create(
// 	data: Omit<Prisma.TestCreateInput, 'user'> & { userId: string }
// ): Promise<TestWithSteps> {
// 	const { userId, ...testData } = data;
// 	return prismaClient.test.create({
// 		data: {
// 			...testData,
// 			user: { connect: { id: userId } },
// 		},
// 		include: { steps: true },
// 	});
// },

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

export const deleteOne = async (id: string): Promise<TestWithSteps> => {
	return prismaClient.test.delete({
		where: { id },
		include: { steps: true },
	});
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
