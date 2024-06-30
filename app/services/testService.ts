'use server';

import { getCurrentUser } from './userService';
import { prismaClient } from '../../db/db.adapter';
import { revalidateTag } from 'next/cache';
import { Test, TestType, StepType, HttpMethod } from '@prisma/client';

const validateTestName = (testName: string) =>
	testName && testName.match(/^[a-zA-Z0-9_]+$/) !== null;

async function getUserId() {
	const user = await getCurrentUser();
	if (!user?.id) throw new Error('User not authenticated');
	return user.id;
}

export async function getTestData(): Promise<Test[]> {
	try {
		const userId = await getUserId();
		const tests = await prismaClient.test.findMany({
			where: { userId },
			include: { steps: true },
		});
		return tests;
	} catch (error) {
		console.error('Error fetching tests:', error);
		throw error;
	}
}

export async function runTest(testId: string) {
	if (!validateTestName(testId)) {
		throw new Error('Invalid test name');
	}

	try {
		// Here you would implement the logic to run the test
		// For now, we'll just log it
		console.log('Running test:', testId);
		// You might want to update the test status in the database here
	} catch (error) {
		console.error('Error running test:', error);
		throw error;
	}
}

export async function deleteTest(testId: string) {
	if (!validateTestName(testId)) {
		throw new Error('Invalid test name');
	}

	try {
		const userId = await getUserId();
		await prismaClient.test.delete({
			where: { id: testId, userId },
		});
		revalidateTag('testData');
	} catch (error) {
		console.error('Error deleting test:', error);
		throw error;
	}
}

export async function addTest(testData: {
	name: string;
	description?: string;
	type: TestType;
	baseUrl: string;
	steps: {
		order: number;
		description: string;
		type: StepType;
		xpath: string;
		userInput?: string;
		httpMethod?: HttpMethod;
		queryParams?: any;
		bodyParams?: any;
		headers?: any;
	}[];
}) {
	try {
		const userId = await getUserId();
		const newTest = await prismaClient.test.create({
			data: {
				...testData,
				userId,
				steps: {
					create: testData.steps,
				},
			},
			include: { steps: true },
		});
		revalidateTag('testData');
		return newTest;
	} catch (error) {
		console.error('Error adding test:', error);
		throw error;
	}
}

export async function updateTest(
	testId: string,
	testData: Partial<Omit<Test, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
) {
	try {
		const userId = await getUserId();
		const updatedTest = await prismaClient.test.update({
			where: { id: testId, userId },
			data: testData,
			include: { steps: true },
		});
		revalidateTag('testData');
		return updatedTest;
	} catch (error) {
		console.error('Error updating test:', error);
		throw error;
	}
}
