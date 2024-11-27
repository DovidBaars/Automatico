'use client';

import React from 'react';
import { Flex } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';

export function Footer() {
	const { width } = useViewportSize();

	return (
		<Flex direction={'row'} h="100%" w={width}>
			{/* <TestInfoPanel width={width * 0.3} /> */}
			{/* <StepEntry width={width * 0.7} /> */}
		</Flex>
	);
}
