'use client';

import React from 'react';
import { Flex } from '@mantine/core';
import { useViewportSize } from '@mantine/hooks';
import { FOOTER_HEIGHT } from '@/constants/app';
import TestEntry from '../testEntry/testEntry';

export function AsideBar() {
	const { height: viewportHeight } = useViewportSize();
	const asideBarHeight = viewportHeight - FOOTER_HEIGHT;

	return (
		<Flex direction="column" h={asideBarHeight}>
			<TestEntry height={asideBarHeight * 0.7} />
			{/* <TestInfoPanel height={asideBarHeight * 0.3} /> */}
		</Flex>
	);
}
