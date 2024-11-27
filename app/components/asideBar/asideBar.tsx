'use client';

import React from 'react';
import { Flex, useMantineTheme } from '@mantine/core';
import TestEntry from '../testEntry/testEntry';

export function AsideBar() {
	const theme = useMantineTheme();
	return (
		<Flex bg={theme.colors.dark[9]} h="100%" direction="column">
			<TestEntry />
		</Flex>
	);
}
