'use server';

import { unstable_cache } from 'next/cache';
import { Prisma, Test } from '@prisma/client';
import { getUserId } from './auth';
import {
	getAllByUserId,
	deleteOne,
	createOne,
	getById,
	deleteMany,
} from '@/repositories/test';
import { authPost } from './fetch';
import { TestWithSteps } from 'app/providers/test';
import { handleRevalidateCache } from './cache';
import { STRINGS } from '@/constants/app';

interface TestResult {
	status: 'success' | 'failure';
	message: string;
	testId: string;
}

export const runTest = async (
	testId: string,
	signal?: AbortSignal
): Promise<TestResult> => {
	try {
		const response = await authPost(
			`http://127.0.0.1:8000/tests/:testId/run`,
			undefined,
			{
				pathParams: { testId },
				signal,
			}
		);
		const data = await response.json();
		console.log('Test run result:', data);
		return data;
	} catch (error) {
		console.error('Error running test:', error);
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				return { status: 'failure', message: 'Test run cancelled', testId };
			}
			return { status: 'failure', message: error.message, testId };
		}
		return {
			status: 'failure',
			message: 'An unexpected error occurred',
			testId,
		};
	}
};

export const runMultipleTests = async (
	testIds: string[],
	signal?: AbortSignal
): Promise<TestResult[]> => {
	try {
		const response = await authPost(
			`http://127.0.0.1:8000/tests/run_multiple`, // Assuming your backend endpoint is /tests/run_multiple
			JSON.stringify(testIds),
			{ signal }
		);
		const data = await response.json();
		console.log('Multiple tests run result:', data);
		return data;
	} catch (error) {
		console.error('Error running multiple tests:', error);
		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				return testIds.map((testId) => ({
					testId,
					status: 'failure',
					message: 'Test run cancelled',
				}));
			}
			return testIds.map((testId) => ({
				testId,
				status: 'failure',
				message: error.message,
			}));
		}
		return testIds.map((testId) => ({
			testId,
			status: 'failure',
			message: 'An unexpected error occurred',
		}));
	}
};

export const getTestById = async (testId: string): Promise<Test | null> => {
	const test = await getById(testId);
	return test;

	// const getCachedTestMetadata = unstable_cache(
	// 	async () => getById(testId),
	// 	[`test-${testId}`],
	// 	{ revalidate: 60 * 5 }
	// );

	// const getLatestResults = unstable_cache(
	// 	async () => getLatestResultsForTest(testId),
	// 	[`test-results-${testId}`],
	// 	{ revalidate: 60 * 3 }
	// );

	// const [test, latestResults] = await Promise.all([
	// 	getCachedTestMetadata(),
	// 	getLatestResults(),
	// ]);

	// 	if (!test) return null;

	// 	return {
	// 		...test,
	// 		steps: test.steps.map((step) => ({
	// 			...step,
	// 			results: latestResults.filter((result) => result.stepId === step.id),
	// 		})),
	// 	};
};

export const getAllTests = async (): Promise<TestWithSteps[]> => {
	const userId = await getUserId();
	const getCachedTests = unstable_cache(
		() => getAllByUserId(userId),
		[`all-tests-${userId}`],
		{ revalidate: 60 * 10 }
	);

	return getCachedTests();
};

export const createTest = async (
	data: Omit<Prisma.TestCreateInput, 'user'> & { userId: string }
): Promise<Test> => {
	const newTest = await createOne(data);
	handleRevalidateCache(
		data.userId,
		undefined,
		undefined,
		STRINGS.PAGES.DASHBOARD.PATH
	);
	return newTest;
};

// public async updateTest(
// 	id: string,
// 	data: Prisma.TestUpdateInput
// ): Promise<Test> {
// 	const updatedTest = await .update(id, data);
// 	revalidateTag(`test-${id}`);
// 	revalidateTag(`all-tests-${updatedTest.userId}`);

// 	return updatedTest;
// }

export const deleteTest = async (id: string): Promise<void> => {
	const userId = await getUserId();
	await deleteOne(id);
	handleRevalidateCache(userId, id, undefined, STRINGS.PAGES.DASHBOARD.PATH);
};

export const deleteTests = async (ids: string[]): Promise<void> => {
	const userId = await getUserId();
	await deleteMany(ids);
	handleRevalidateCache(userId, undefined, ids, STRINGS.PAGES.DASHBOARD.PATH);
};

// public async updateTestResults(
// 	testId: string,
// 	stepData: Omit<Prisma.StepCreateInput, 'test'>,
// 	userId: string
// ): Promise<void> {
// 	await .upsertStepResult(testId, stepData);
// 	revalidateTag(`test-results-${testId}`);
// 	revalidateTag(`all-tests-${userId}`);
// }
// }
