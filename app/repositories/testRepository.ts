'use server';

import { Prisma, Test, Step, Result } from '@prisma/client';
import { prismaClient } from '../../db/db.adapter';
import { ResultArg } from '@prisma/client/runtime/library';

type TestWithSteps = Test & { steps: Step[] };

export const TestRepository = {
	async getById(id: string): Promise<TestWithSteps | null> {
		return prismaClient.test.findUnique({
			where: { id },
			include: {
				steps: {
					orderBy: { order: 'asc' },
				},
			},
		});
	},

	async getAllByUserId(userId: string): Promise<TestWithSteps[]> {
		return prismaClient.test.findMany({
			where: { user: { id: userId } },
			include: { steps: true },
		});
	},

	async create(
		data: Omit<Prisma.TestCreateInput, 'user'> & { userId: string }
	): Promise<TestWithSteps> {
		const { userId, ...testData } = data;
		return prismaClient.test.create({
			data: {
				...testData,
				user: { connect: { id: userId } },
			},
			include: { steps: true },
		});
	},

	async update(
		id: string,
		data: Prisma.TestUpdateInput
	): Promise<TestWithSteps> {
		return prismaClient.test.update({
			where: { id },
			data,
			include: { steps: true },
		});
	},

	async delete(id: string): Promise<TestWithSteps> {
		return prismaClient.test.delete({
			where: { id },
			include: { steps: true },
		});
	},

	async getLatestResultsForTest(testId: string): Promise<Result[]> {
		return prismaClient.result.findMany({
			where: {
				step: {
					testId: testId,
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		});
	},

	async upsertStepResult(
		testId: string,
		stepData: Omit<Prisma.StepCreateInput, 'test'>
	): Promise<Step> {
		return prismaClient.step.upsert({
			where: {
				testId_order: {
					testId,
					order: stepData.order,
				},
			},
			update: stepData,
			create: {
				...stepData,
				test: { connect: { id: testId } },
			},
		});
	},
};
