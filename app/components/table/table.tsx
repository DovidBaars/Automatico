'use client';

import { useEffect, useState } from 'react';
import {
	Table,
	LoadingOverlay,
	Stack,
	TableScrollContainer,
	useMantineTheme,
} from '@mantine/core';
import { Test } from '@prisma/client';
import {
	deleteTest,
	deleteTests,
	runMultipleTests,
	runTest,
} from '@/services/test';
import { filterData } from '../../dashboard/util';
import { TestWithSteps } from 'app/providers/test';
import TableRows from './tableRows';
import TableHeader from './tableHeader';
import SearchBar from './searchBar';
import { useTest } from 'app/contexts/test';

export default function TestTable() {
	const [batchSelection, setBatchSelection] = useState<Test['id'][]>([]);
	const [search, setSearch] = useState('');
	const [searchFilteredData, setSearchFilteredData] = useState<TestWithSteps[]>(
		[]
	);
	const { setCurrentTest, currentTest, loading, fetchTests, userTests } =
		useTest();

	useEffect(() => {
		setSearchFilteredData(filterData(userTests, search));
	}, [userTests, search]);

	const theme = useMantineTheme();

	const handleReload = () => {
		fetchTests(true);
	};

	const handleRun = async (id: string) => {
		const { status, message } = await runTest(id);
		alert(
			userTests.find((item) => item.id === id)?.name +
				' ' +
				(status === 'success' ? '\u2705 ' : '\u274C') +
				'\n' +
				message
		);
	};

	const handleBatchDelete = async () => {
		await deleteTests(batchSelection);
		handleReload();
	};

	const toggleRow = (id: Test['id']) => {
		console.log(id);
		setBatchSelection((current) =>
			current.includes(id)
				? current.filter((item) => item !== id)
				: [...current, id]
		);
	};
	const toggleAll = () =>
		setBatchSelection((current) =>
			current.length === userTests.length
				? []
				: userTests.map((item) => item.id)
		);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setSearch(value);
	};

	const handleRowClick = (rowId: TestWithSteps['id']) => {
		if (currentTest?.id === rowId) {
			setCurrentTest(null);
			return;
		}
		const test: TestWithSteps = userTests.find((test) => test.id === rowId)!;
		setCurrentTest(test);
	};

	const handleDelete = async (id: string) => {
		await deleteTest(id);
		handleReload();
	};

	const handleBatchRun = async () => {
		const result = await runMultipleTests(batchSelection);
		alert(
			result
				.map(
					(item) =>
						`${userTests.find((test) => test.id === item.testId)?.name} ${item.status === 'success' ? '\u2705' : '\u274C'} ${item.message}`
				)
				.join('\n\n')
		);
	};

	return (
		<Stack bg={theme.colors.dark[9]} gap={'xs'}>
			<TableScrollContainer p="0" m="0" minWidth={theme.breakpoints.md}>
				<LoadingOverlay visible={loading} />
				<Table withColumnBorders withTableBorder>
					<SearchBar
						search={search}
						handleSearchChange={handleSearchChange}
						handleReload={handleReload}
						handleBatchDelete={handleBatchDelete}
						batchSelection={batchSelection.length > 0}
						handleBatchRun={handleBatchRun}
					/>
					<TableHeader
						toggleAll={toggleAll}
						batchSelection={batchSelection}
						userTests={userTests}
					/>
					<Table.Tbody>
						<TableRows
							batchSelection={batchSelection}
							toggleRow={toggleRow}
							handleRowClick={handleRowClick}
							onRunTest={handleRun}
							onDeleteTest={handleDelete}
							currentTest={currentTest}
							data={searchFilteredData}
						/>
					</Table.Tbody>
				</Table>
			</TableScrollContainer>
		</Stack>
	);
}
