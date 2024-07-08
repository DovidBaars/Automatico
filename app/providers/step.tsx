'use client';

import React, { createContext, useState } from 'react';
import { Prisma } from '@prisma/client';
import { createStep } from '@/services/step';

export interface StepContextType {
	handleCreateStep: (
		stepData: Omit<Prisma.StepCreateInput, 'test'> & { testId: string }
	) => Promise<void>;
	// handleUpdateStep: (stepId: string, stepData: Prisma.StepUpdateInput) => Promise<void>;
	// handleDeleteStep: (stepId: string) => Promise<void>;
	stepError: string | null;
}

export const StepContext = createContext<StepContextType | undefined>(
	undefined
);

export function StepProvider({ children }: { children: React.ReactNode }) {
	const [stepError, setStepError] = useState<string | null>(null);

	const handleCreateStep = async (
		stepData: Omit<Prisma.StepCreateInput, 'test'> & { testId: string }
	) => {
		try {
			await createStep(stepData);
		} catch (error) {
			console.error('Error creating step:', error);
			setStepError('Failed to create step');
		}
	};

	// const handleUpdateStep = async (stepId: string, stepData: Prisma.StepUpdateInput) => {
	//     try {
	//         await updateStep(stepId, stepData);
	//     } catch (error) {
	//         console.error('Error updating step:', error);
	//         setStepError('Failed to update step');
	//     }
	// };

	// const handleDeleteStep = async (stepId: string) => {
	//     try {
	//         await deleteStep(stepId);
	//     } catch (error) {
	//         console.error('Error deleting step:', error);
	//         setStepError('Failed to delete step');
	//     }
	// };

	const value = {
		handleCreateStep,
		// handleUpdateStep,
		// handleDeleteStep,
		stepError,
	};

	return <StepContext.Provider value={value}>{children}</StepContext.Provider>;
}
