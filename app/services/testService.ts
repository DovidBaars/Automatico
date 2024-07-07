'use server';

import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache';
import { Prisma, Test } from '@prisma/client';
import { getUserId } from './authService';
import {
	getAllByUserId,
	deleteOne,
	createOne,
	getById,
	deleteMany,
} from '@/repositories/testRepository';
import { authPost } from './authFetchService';
import { TestWithSteps } from 'app/providers/testProvider';

interface TestResult {
	status: 'success' | 'failure';
	message: string;
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
				return { status: 'failure', message: 'Test run cancelled' };
			}
			return { status: 'failure', message: error.message };
		}
		return { status: 'failure', message: 'An unexpected error occurred' };
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
	handleRevalidateCache(data.userId);
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
	handleRevalidateCache(userId, id);
};

export const deleteTests = async (ids: string[]): Promise<void> => {
	const userId = await getUserId();
	await deleteMany(ids);
	handleRevalidateCache(userId, undefined, ids);
};

export const handleRevalidateCache = async (
	userId?: string,
	testId?: string,
	testIds?: string[]
) => {
	userId = userId || (await getUserId());
	revalidateTag(`all-tests-${userId}`);
	testId && revalidateTag(`test-${testId}`);
	testIds && testIds.forEach((id) => revalidateTag(`test-${id}`));
	revalidatePath('/dashboard');
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
