'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Test, Step, Result, Prisma, TestType } from '@prisma/client';
import {
	getAllTests,
	handleRevalidateCache,
	createTest,
} from '@/services/testService';
import { getUserId } from '@/services/authService';

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

const TestContext = createContext<TestContextType | undefined>(undefined);

export function TestProvider({ children }: { children: React.ReactNode }) {
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
			forceReload && handleRevalidateCache();
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
		console.log('Adding test:', {
			name: testName,
			description: testDescription,
		});
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
			return;
		} catch (error) {
			console.error('Error creating test:', error);
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

export function useTest() {
	const context = useContext(TestContext);
	if (context === undefined) {
		throw new Error('useTest must be used within a TestProvider');
	}
	return context;
}
