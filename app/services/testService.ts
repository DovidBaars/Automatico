'use server';

import { unstable_cache, revalidateTag } from 'next/cache';
import { Prisma, Test, Step } from '@prisma/client';
import { TestRepository } from '@/repositories/testRepository';
import { authPost } from './authFetchService';
import { AuthService } from './authService';

interface TestResult {
	status: 'success' | 'failure';
	message: string;
}

export namespace TestService {
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

	const getTestById = async (
		testId: string
	): Promise<(Test & { steps: Step[] }) | null> => {
		const getCachedTestMetadata = unstable_cache(
			async () => TestRepository.getById(testId),
			[`test-${testId}`],
			{ revalidate: 60 * 5 }
		);

		const getLatestResults = unstable_cache(
			async () => TestRepository.getLatestResultsForTest(testId),
			[`test-results-${testId}`],
			{ revalidate: 60 * 3 }
		);

		const [test, latestResults] = await Promise.all([
			getCachedTestMetadata(),
			getLatestResults(),
		]);

		if (!test) return null;

		return {
			...test,
			steps: test.steps.map((step) => ({
				...step,
				results: latestResults.filter((result) => result.stepId === step.id),
			})),
		};
	};

	export const getAllTests = async (): Promise<Test[]> => {
		const userId = await AuthService.getUserId();

		const getCachedTests = unstable_cache(
			async () => TestRepository.getAllByUserId(userId),
			[`all-tests-${userId}`],
			{ revalidate: 60 * 10 }
		);

		return getCachedTests();
	};

	const createTest = async (
		data: Omit<Prisma.TestCreateInput, 'user'> & { userId: string }
	): Promise<Test> => {
		const newTest = await TestRepository.create(data);
		revalidateTag(`test-${newTest.id}`);
		revalidateTag(`all-tests-${data.userId}`);
		return newTest;
	};

	const updateTest = async (
		id: string,
		data: Prisma.TestUpdateInput
	): Promise<Test> => {
		const updatedTest = await TestRepository.update(id, data);
		revalidateTag(`test-${id}`);
		revalidateTag(`all-tests-${updatedTest.userId}`);

		return updatedTest;
	};

	export const deleteTest = async (id: string): Promise<void> => {
		const userId = await AuthService.getUserId();
		await TestRepository.delete(id);
		revalidateTag(`test-${id}`);
		revalidateTag(`all-tests-${userId}`);
	};

	const updateTestResults = async (
		testId: string,
		stepData: Omit<Prisma.StepCreateInput, 'test'>,
		userId: string
	): Promise<void> => {
		await TestRepository.upsertStepResult(testId, stepData);
		revalidateTag(`test-results-${testId}`);
		revalidateTag(`all-tests-${userId}`);
	};
}
