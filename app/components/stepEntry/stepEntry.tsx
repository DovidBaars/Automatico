'use client';

import { Select, TextInput, Textarea, Button, Flex } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import classes from './stepEntry.module.css';
import { useTest } from 'app/contexts/test';
import { $Enums } from '@prisma/client';

const StepEntry = () => {
	const [type, setType] = useState<$Enums.StepType>($Enums.StepType.INPUT);
	const [xpath, setXpath] = useState('');
	const [userInput, setUserInput] = useState('');
	const [description, setDescription] = useState('');
	const { handleCreateStep, currentTest } = useTest();

	const handleAddStep = async () => {
		if (!currentTest?.id) {
			console.error('No test selected');
			return;
		}
		const stepData = {
			type,
			xpath,
			userInput,
			description,
			order: 1,
			testId: currentTest.id,
		};
		await handleCreateStep(stepData);
		setXpath('');
		setUserInput('');
		setDescription('');
	};
	return (
		<Flex
			direction={'row'}
			p="sm"
			m="0"
			className={classes.stepEntry}
			justify={'space-between'}
			align={'flex-start'}
		>
			<Select
				size="xs"
				label="Step Type"
				value={type}
				onChange={(value) =>
					setType((value as $Enums.StepType) || $Enums.StepType.INPUT)
				}
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
			{type === 'INPUT' && (
				<TextInput
					size="xs"
					label="User Input"
					value={userInput}
					onChange={(event) => setUserInput(event.currentTarget.value)}
					placeholder="Enter user input"
				/>
			)}

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
				size="sm"
				onClick={handleAddStep}
				leftSection={<IconPlus size="0.8rem" />}
				variant="gradient"
				gradient={{ from: 'teal', to: 'blue', deg: 60 }}
				style={{ alignSelf: 'flex-end' }}
			>
				Add Step
			</Button>
		</Flex>
	);
};

export default StepEntry;
