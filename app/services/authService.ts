'use server';

import { auth } from 'auth/auth';
import { SignJWT } from 'jose';

const generateToken = async (payload: any): Promise<string> => {
	const iat = Math.floor(Date.now() / 1000);
	const exp = iat + 60 * 60;

	return new SignJWT({ ...payload })
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setExpirationTime(exp)
		.setIssuedAt(iat)
		.setNotBefore(iat)
		.sign(new TextEncoder().encode(process.env.AUTH_SECRET));
};

export const getUserId = async () => {
	const session = await auth();
	if (!session?.user?.id) {
		console.error('Error getting user ID. No user ID.');
		throw new Error('No authenticated user');
	}
	return session.user.id;
};

export const getUserName = async () => {
	const session = await auth();
	if (!session?.user?.name) {
		console.error('Error getting user name. No user name.');
		throw new Error('No authenticated user');
	}
	return session.user.name;
};

export const getUserToken = async () => {
	const session = await auth();
	if (!session?.user?.id) {
		console.error('Error getting user token. No user ID.');
		throw new Error('No authenticated user');
	}
	const token = await generateToken({
		userId: session.user.id,
		email: session.user.email,
	});
	return token;
};
