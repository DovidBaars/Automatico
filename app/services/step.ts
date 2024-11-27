'use server';

import { Prisma } from '@prisma/client';
import { handleRevalidateCache } from './cache';
import { createOne } from '@/repositories/step';
import { STRINGS } from '@/constants/app';

export const createStep = async (
	stepData: Omit<Prisma.StepCreateInput, 'test'> & { testId: string }
) => {
	const newStep = await createOne(stepData);
	handleRevalidateCache(
		undefined,
		undefined,
		undefined,
		STRINGS.PAGES.DASHBOARD.PATH
	);
	return newStep;
};
