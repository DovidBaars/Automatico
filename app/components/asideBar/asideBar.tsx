'use client';

import React, { useState } from 'react';
import { Text, TextInput, Button, Stack, Box, SegmentedControl } from '@mantine/core';
import segmentedControlClasses from './segmentedControl.module.css'
import classes from './asideBar.module.css';
import { createTest } from '@/services/testService';
import { Prisma, TestType } from '@prisma/client';
import { getUserId } from '@/services/authService';

export function AsideBar() {
    const [testType, setTestType] = useState('Web');
    const [testName, setTestName] = useState('');
    const [testDescription, setTestDescription] = useState('');

    const handleAddTest = async () => {
        console.log('Adding test:', { name: testName, description: testDescription });
        const test: Omit<Prisma.TestCreateInput, 'user'> & { userId: string } = { name: testName, description: testDescription, type: TestType[testType.toUpperCase()], baseUrl: 'test', userId: await getUserId() };
        try {
            const newTest = await createTest(test)
            console.log('New test:', newTest);
            setTestName('');
            setTestDescription('');
        } catch (error) {
            console.error('Error creating test:', error);
        }
    };

    return (
        <Box p="md" className={classes.aside}>
            <Stack>
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
                <Box p='sm' >
                    <Text size="lg" className={classes.title}>{testType}</Text>
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
                        <Button onClick={handleAddTest} className={classes.button}>Add Test</Button>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}