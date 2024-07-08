'use client';

import { StepContext } from 'app/providers/step';
import { TestContext } from 'app/providers/test';
import { useContext } from 'react';

export function useTest() {
	const testContext = useContext(TestContext);
	const stepContext = useContext(StepContext);

	if (testContext === undefined || stepContext === undefined) {
		throw new Error('useTest must be used within a TestWithStepProvider');
	}

	return { ...testContext, ...stepContext };
}
