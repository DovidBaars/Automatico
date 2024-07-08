'use client';

import { Flex, useMantineTheme } from '@mantine/core';
import TestTable from '../components/table/table';

const Dashboard = () => {
	const theme = useMantineTheme();
	return (
		<Flex direction="column" h="100vh" p="0" bg={theme.colors.dark[9]}>
			<TestTable />
		</Flex>
	);
};

export default Dashboard;
