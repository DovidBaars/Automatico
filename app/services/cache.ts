'use server';

import { revalidatePath, revalidateTag } from 'next/cache';

export const handleRevalidateCache = (
	userId?: string,
	testId?: string,
	testIds?: string[],
	path?: string
) => {
	userId && revalidateTag(`all-tests-${userId}`);
	testId && revalidateTag(`test-${testId}`);
	testIds && testIds.forEach((id) => revalidateTag(`test-${id}`));
	path && revalidatePath(path);
};
