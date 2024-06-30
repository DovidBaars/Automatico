'use server';

import { auth } from './authService';

export async function getCurrentUser() {
	const session = await auth();
	return session?.user ?? null;
}
