'use server';

import { getDocs, collection, DocumentData } from 'firebase/firestore';
import { revalidateTag } from 'next/cache';
import { Test } from './interface';
import { TESTS_COLLECTION } from '@/constants/firebase';
import { auth } from '@/auth';
import { db } from '@/firebase';

export const getTestData = async () => {
	try {
		const userId = (await auth())?.user?.id;
		console.log('userId:', userId);
		if (!userId) throw new Error('User not authenticated');
		const collectionRef = collection(
			db,
			TESTS_COLLECTION.name,
			userId,
			TESTS_COLLECTION.subName
		);
		const documents = await getDocs(collectionRef);
		const data: DocumentData[] = documents.docs.map((doc) => doc.data());
		console.log('data:', data);
		return data as Test[];
	} catch (error) {
		console.error('Error fetching tests:', error);
		throw error;
	}
};

const validateTestName = (testName: string) =>
	testName && testName.match(/^[a-zA-Z0-9_]+$/) !== null;

export const runTest = async (testName: string) => {
	if (!validateTestName(testName)) {
		console.error('Invalid test name:', testName);
		return;
	}
	console.log('running test', testName);
	try {
		const response = await fetch('http://127.0.0.1:5000/runTest', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ testName }),
		});

		const data = await response.json();
		if (data.error) {
			console.log(`Failed to run test: ${data.error}`);
		} else {
			console.log('Test run successfully!');
		}
	} catch (error) {
		console.error('Error running test:', error);
	}
};

export const deleteTest = async (testName: string) => {
	if (!validateTestName(testName)) {
		console.error('Invalid test name:', testName);
		return;
	}
	try {
		const response = await fetch(`/api/delete/${testName}`, {
			method: 'DELETE',
		});

		const data = await response.json();
		if (data.success) {
			revalidateTag('testData');
			location.reload();
		} else {
			alert(`Failed to delete test: ${data.error}`);
		}
	} catch (error) {
		console.error('Error deleting test:', error);
	}
};
