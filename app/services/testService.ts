'use server';

import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache';
import { Prisma, Test } from '@prisma/client';
import { getUserId } from './authService';
import {
	getAllByUserId,
	deleteOne,
	createOne,
	getById,
} from '@/repositories/testRepository';
import { authPost } from './authFetchService';

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
			null,
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

export const getAllTests = async (forceReload = false): Promise<Test[]> => {
	console.log('TS GET ALL TESTS');
	const userId = await getUserId();
	console.log('TS GET ALL TESTS - userId:', userId);
	if (forceReload) {
		console.log('TS GET ALL TESTS - force reload');
	}
	const getCachedTests = unstable_cache(
		async () => getAllByUserId(userId),
		[`all-tests-${userId}`],
		{ revalidate: 60 * 10 }
	);

	return getCachedTests();
};

export const createTest = async (
	data: Omit<Prisma.TestCreateInput, 'user'> & { userId: string }
): Promise<Test> => {
	const newTest = await createOne(data);
	revalidateTag(`test-${newTest.id}`);
	revalidateTag(`all-tests-${data.userId}`);
	// this is the only one having an effect - investigate
	revalidatePath('/dashboard');
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
	revalidateTag(`test-${id}`);
	revalidateTag(`all-tests-${userId}`);
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
