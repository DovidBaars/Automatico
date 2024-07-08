'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { Test, Step, Result, Prisma, TestType } from '@prisma/client';
import { getAllTests, createTest } from '@/services/test';
import { handleRevalidateCache } from '@/services/cache';
import { getUserId } from '@/services/auth';
import { StepContextType, StepProvider, StepContext } from './step';
import { STRINGS } from '@/constants/app';

export interface TestWithSteps extends Test {
	steps: (Step & { results: Result[] })[];
}

interface TestContextType {
	currentTest: TestWithSteps | null;
	setCurrentTest: React.Dispatch<React.SetStateAction<TestWithSteps | null>>;
	loading: boolean;
	error: string | null;
	fetchTests: (forceReload?: boolean) => Promise<TestWithSteps[]>;
	userTests: TestWithSteps[];
	handleCreateTest: (
		testName: string,
		testDescription: string,
		testType: TestType,
		baseUrl: string
	) => Promise<void>;
}

export const TestContext = createContext<TestContextType | undefined>(
	undefined
);

function TestProvider({ children }: { children: React.ReactNode }) {
	const [userTests, setUserTests] = useState<TestWithSteps[]>([]);
	const [currentTest, setCurrentTest] = useState<TestWithSteps | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		console.log('TestProvider - useEffect');
		fetchTests();
	}, []);

	const fetchTests = async (forceReload = false) => {
		setLoading(true);
		let data: TestWithSteps[] = [];
		try {
			forceReload &&
				handleRevalidateCache(
					undefined,
					undefined,
					undefined,
					STRINGS.PAGES.DASHBOARD.PATH
				);
			data = await getAllTests();
			setUserTests(data);
		} catch (err) {
			setError('Failed to fetch test data');
		} finally {
			setLoading(false);
			return data;
		}
	};

	const handleCreateTest = async (
		testName: string,
		testDescription: string,
		testType: TestType,
		baseUrl: string
	) => {
		try {
			const test: Omit<Prisma.TestCreateInput, 'user'> & { userId: string } = {
				name: testName,
				description: testDescription,
				type: testType.toUpperCase() as TestType,
				baseUrl: baseUrl,
				userId: await getUserId(),
			};
			await createTest(test);
			fetchTests(true);
		} catch (error) {
			console.error('Error creating test:', error);
			setError('Failed to create test');
		}
	};

	const value = {
		currentTest,
		setCurrentTest,
		loading,
		error,
		fetchTests,
		userTests,
		handleCreateTest,
	};

	return <TestContext.Provider value={value}>{children}</TestContext.Provider>;
}

type CombinedContextType = TestContextType & StepContextType;

const CombinedContext = createContext<CombinedContextType | undefined>(
	undefined
);

export function TestWithStepProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<TestProvider>
			<StepProvider>
				<TestContext.Consumer>
					{(testValue) => (
						<StepContext.Consumer>
							{(stepValue) => {
								const mergedValue: CombinedContextType = {
									...(testValue as TestContextType),
									...(stepValue as StepContextType),
								};
								return (
									<CombinedContext.Provider value={mergedValue}>
										{children}
									</CombinedContext.Provider>
								);
							}}
						</StepContext.Consumer>
					)}
				</TestContext.Consumer>
			</StepProvider>
		</TestProvider>
	);
}

export function useCombinedContext() {
	const context = useContext(CombinedContext);
	if (context === undefined) {
		throw new Error(
			'useCombinedContext must be used within a TestWithStepProvider'
		);
	}
	return context;
}
