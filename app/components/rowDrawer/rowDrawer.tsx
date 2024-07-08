import React from 'react';
import { Drawer, Stack, Text, Button } from '@mantine/core';
import { TestWithSteps } from 'app/providers/test';

interface StepsDrawerProps {
	opened: boolean;
	onClose: () => void;
	test: TestWithSteps;
}

const RowDrawer: React.FC<StepsDrawerProps> = ({ opened, onClose, test }) => {
	return (
		<Drawer
			opened={opened}
			onClose={onClose}
			title={`Steps for ${test.name}`}
			position="right"
			size="md"
		>
			<Stack>
				{test.steps?.map((step, index) => (
					<div key={step.id}>
						<Text fw={700}>
							Step {index + 1}: {step.type}
						</Text>
						<Text>{step.description}</Text>
					</div>
				)) || <Text>No steps available</Text>}
			</Stack>
			<Button fullWidth onClick={onClose} mt="xl">
				Close
			</Button>
		</Drawer>
	);
};

export default RowDrawer;
