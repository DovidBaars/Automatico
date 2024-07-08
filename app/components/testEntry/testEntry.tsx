import {
	Flex,
	SegmentedControl,
	Box,
	Stack,
	TextInput,
	Button,
	Text,
} from '@mantine/core';
import classes from './testEntry.module.css';
import segmentedControlClasses from './segmentedControl.module.css';
import { TestType } from '@prisma/client';
import { useState } from 'react';
import { useTest } from 'app/providers/testProvider';

const TestEntry = () => {
	const [testType, setTestType] = useState('Web');
	const [testName, setTestName] = useState('');
	const [testDescription, setTestDescription] = useState('');
	const [baseUrl, setBaseUrl] = useState('');
	const { handleCreateTest } = useTest();

	const handleAddTest = async () => {
		await handleCreateTest(
			testName,
			testDescription,
			testType as TestType,
			baseUrl
		);
		setTestName('');
		setTestDescription('');
	};

	return (
		<Flex direction="column" p="sm" className={classes.testEntry}>
			<SegmentedControl
				fullWidth
				radius="xl"
				size="md"
				data={['Web', 'Mobile', 'API']}
				classNames={segmentedControlClasses}
				mb="md"
				value={testType}
				onChange={setTestType}
			/>
			<Box className={classes.inputBox} mb="sm">
				<Text size="lg" className={classes.title}>
					{testType}
				</Text>
				<Stack>
					<TextInput
						label="Test Name"
						value={testName}
						onChange={(event) => setTestName(event.currentTarget.value)}
						placeholder="Enter test name"
						className={classes.input}
					/>
					<TextInput
						label="Test Description"
						value={testDescription}
						onChange={(event) => setTestDescription(event.currentTarget.value)}
						placeholder="Enter test description"
						className={classes.input}
					/>
					<TextInput
						label="Base URL"
						value={baseUrl}
						onChange={(event) => setBaseUrl(event.currentTarget.value)}
						placeholder="Enter Base Url"
						className={classes.input}
					/>
					<Button onClick={handleAddTest} className={classes.button}>
						Add Test
					</Button>
				</Stack>
			</Box>
		</Flex>
	);
};

export default TestEntry;
