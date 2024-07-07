'use client';

import {
	Stack,
	Box,
	Divider,
	Group,
	Select,
	TextInput,
	Textarea,
	Button,
	MantineStyleProps,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './stepEntry.module.css';

const StepEntry = ({ width }: { width: MantineStyleProps['w'] }) => {
	const [stepType, setStepType] = useState('INPUT');
	const [xpath, setXpath] = useState('');
	const [userInput, setUserInput] = useState('');
	const [description, setDescription] = useState('');

	const handleAddStep = () => {
		console.log('Adding step:', { stepType, xpath, userInput, description });
		// Here you would add the logic to save the step
		// Reset the form
		setXpath('');
		setUserInput('');
		setDescription('');
	};
	return (
		<Stack gap={0} className={classes.stepEntry} w={width}>
			<Box p="xs" style={{ flex: 1, overflowY: 'hidden' }}>
				<Divider
					size="xs"
					label="Add Test Step"
					labelPosition="center"
					mb="xs"
				/>
				<Group grow align="flex-start" mb="xs">
					<Select
						size="xs"
						label="Step Type"
						value={stepType}
						onChange={(value) => setStepType(value || 'INPUT')}
						data={[
							{ value: 'INPUT', label: 'Input' },
							{ value: 'BUTTON', label: 'Button' },
							{ value: 'ASSERTION', label: 'Assertion' },
						]}
					/>
					<TextInput
						size="xs"
						label="XPath"
						value={xpath}
						onChange={(event) => setXpath(event.currentTarget.value)}
						placeholder="Enter the XPath"
					/>
					{stepType === 'INPUT' && (
						<TextInput
							size="xs"
							label="User Input"
							value={userInput}
							onChange={(event) => setUserInput(event.currentTarget.value)}
							placeholder="Enter user input"
						/>
					)}
				</Group>
				<Group justify="space-between" p="0">
					<Textarea
						size="xs"
						label="Step Description"
						value={description}
						onChange={(event) => setDescription(event.currentTarget.value)}
						placeholder="Describe this step"
						minRows={2}
						maxRows={2}
						style={{ flexGrow: 0.7 }}
					/>

					<Button
						m="auto"
						size="sm"
						onClick={handleAddStep}
						leftSection={<IconPlus size="0.8rem" />}
						variant="gradient"
						gradient={{ from: 'teal', to: 'blue', deg: 60 }}
					>
						Add Step
					</Button>
				</Group>
			</Box>
		</Stack>
	);
};

export default StepEntry;
