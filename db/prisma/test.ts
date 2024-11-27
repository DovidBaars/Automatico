// 'use server';

// import { auth } from '@/services/authService';
// import { prismaClient } from '../db.adapter';
// import { TestType, StepType, HttpMethod } from '@prisma/client';

// export const createTestTests = async () => {
// 	const session = await auth();

// 	if (!session || !session.user?.id) {
// 		throw new Error('User not authenticated');
// 	}

// 	const userId = session.user.id;
// 	try {
// 		const newTest = await prismaClient.test.create({
// 			data: {
// 				name: 'Login Flow Test',
// 				description: 'Validates the user login process',
// 				type: TestType.WEB,
// 				baseUrl: 'https://example.com',
// 				userId: userId,
// 				steps: {
// 					create: [
// 						{
// 							order: 1,
// 							description: 'Check login page',
// 							type: StepType.ASSERTION,
// 							xpath: '//h1[contains(text(), "Login")]',
// 							queryParams: { page: 'login' },
// 						},
// 						{
// 							order: 2,
// 							description: 'Enter username',
// 							type: StepType.INPUT,
// 							xpath: '//input[@name="username"]',
// 							userInput: 'testuser',
// 						},
// 						{
// 							order: 3,
// 							description: 'Enter password',
// 							type: StepType.INPUT,
// 							xpath: '//input[@name="password"]',
// 							userInput: 'password123',
// 						},
// 						{
// 							order: 4,
// 							description: 'Submit login form',
// 							type: StepType.BUTTON,
// 							xpath: '//button[@type="submit"]',
// 							httpMethod: HttpMethod.POST,
// 							bodyParams: { username: 'testuser', password: 'password123' },
// 						},
// 						{
// 							order: 5,
// 							description: 'Assert successful login',
// 							type: StepType.ASSERTION,
// 							xpath: '//div[contains(text(), "Welcome")]',
// 							queryParams: { page: 'dashboard' },
// 						},
// 					],
// 				},
// 			},
// 			include: {
// 				steps: true,
// 			},
// 		});

// 		return newTest;
// 	} catch (error) {
// 		console.error('Error creating test:', error);
// 		throw error;
// 	}
// };
