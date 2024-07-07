'use client';

import { useEffect, useState } from 'react';
import {
	Table,
	Checkbox,
	rem,
	TextInput,
	Group,
	Text,
	LoadingOverlay,
	Stack,
	Box,
	Button,
	Tooltip,
	TableScrollContainer,
	useMantineTheme,
} from '@mantine/core';
import { Test } from '@prisma/client';
import { IconSearch, IconReload, IconTrash } from '@tabler/icons-react';
import { deleteTest, deleteTests, runTest } from '@/services/testService';
import SortedThComponent from './sortedTh';
import { sortData } from '../../dashboard/util';
import { useViewportSize } from '@mantine/hooks';
import { FOOTER_HEIGHT } from '@/constants/app';
import { TestWithSteps, useTest } from 'app/providers/testProvider';
import TableRow from './tableRow';
import classes from './table.module.css';

export type StringTypedTest = Record<keyof TestWithSteps, string>;

export default function TestTable() {
	const [batchSelection, setBatchSelection] = useState<Test['id'][]>([]);
	const [search, setSearch] = useState('');
	const [sortedData, setSortedData] = useState<
		TestWithSteps[] | StringTypedTest[]
	>([]);
	const [sortBy, setSortBy] = useState<keyof Test | null>(null);
	const [reverseSortDirection, setReverseSortDirection] = useState(false);
	const { setCurrentTest, currentTest, loading, fetchTests, userTests } =
		useTest();

	const { height } = useViewportSize();
	const theme = useMantineTheme();

	useEffect(() => {
		setSortedData(
			sortData(userTests, { sortBy, reversed: reverseSortDirection, search })
		);
	}, [userTests, reverseSortDirection, sortBy, search]);

	const handleReload = () => {
		fetchTests(true);
	};

	const handleRun = async (id: string) => {
		await runTest(id);
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
			current.length === sortedData.length
				? []
				: sortedData.map((item) => item.id)
		);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.currentTarget;
		setSearch(value);
		setSortedData(
			sortData(userTests, {
				sortBy,
				reversed: reverseSortDirection,
				search: value,
			})
		);
	};

	const setSorting = (field: keyof Test) => {
		const reversed = field === sortBy ? !reverseSortDirection : false;
		setReverseSortDirection(reversed);
		setSortBy(field);
		setSortedData(sortData(userTests, { sortBy: field, reversed, search }));
	};

	const handleRowClick = (row: TestWithSteps | StringTypedTest) => {
		const test: TestWithSteps = userTests.find((test) => test.id === row.id)!;
		setCurrentTest(test);
	};

	const rows = sortedData.map((row) => (
		<TableRow
			key={row.id}
			row={row}
			batchSelection={batchSelection}
			toggleRow={toggleRow}
			handleRowClick={handleRowClick}
			onRunTest={handleRun}
			onDeleteTest={async (id) => {
				console.log(`Deleting test ${id}`);
				await deleteTest(id);
				handleReload();
			}}
			isCurrentTest={row.id === currentTest?.id}
		/>
	));

	const sortHeader = (
		<Table.Thead p="0" m="0">
			<Table.Tr>
				<Table.Th w={rem(40)}>
					<Checkbox
						onChange={toggleAll}
						checked={batchSelection.length === sortedData.length}
						indeterminate={
							batchSelection.length > 0 &&
							batchSelection.length !== sortData.length
						}
					/>
				</Table.Th>
				<SortedThComponent
					sorted={sortBy === 'id'}
					reversed={reverseSortDirection}
					onSort={() => setSorting('id')}
				>
					Id
				</SortedThComponent>
				<SortedThComponent
					sorted={sortBy === 'name'}
					reversed={reverseSortDirection}
					onSort={() => setSorting('name')}
				>
					Name
				</SortedThComponent>
				<Table.Th>Actions</Table.Th>
			</Table.Tr>
		</Table.Thead>
	);

	const searchHeader = (
		<Box className={classes.stickyHeader} p="sm" pl="5" pb="0" mb="0">
			<Group justify="space-between" align="flex-start">
				<TextInput
					placeholder="Search by any field"
					leftSection={
						<IconSearch
							style={{ width: rem(16), height: rem(16) }}
							stroke={1.5}
						/>
					}
					value={search}
					onChange={handleSearchChange}
					style={{ flex: 1 }}
				/>
				<Tooltip label="Reload tests">
					<Button onClick={handleReload} variant="light">
						<IconReload style={{ width: rem(16), height: rem(16) }} />
					</Button>
				</Tooltip>
				<Tooltip label="Delete selected tests">
					<Button
						onClick={handleBatchDelete}
						variant="light"
						disabled={batchSelection.length === 0}
					>
						<IconTrash style={{ width: rem(16), height: rem(16) }} />
					</Button>
				</Tooltip>
			</Group>
		</Box>
	);

	return (
		<Stack h={rem(height - FOOTER_HEIGHT)} bg={theme.colors.dark[9]} gap={'xs'}>
			{searchHeader}
			<TableScrollContainer p="0" m="0" minWidth={undefined}>
				<LoadingOverlay visible={loading} />
				<Table withColumnBorders withTableBorder>
					{sortHeader}
					<Table.Tbody>
						{rows.length > 0 ? (
							rows
						) : (
							<Table.Tr>
								<Table.Td colSpan={3}>
									<Text fw={500} ta="center">
										Nothing found
									</Text>
								</Table.Td>
							</Table.Tr>
						)}
					</Table.Tbody>
				</Table>
			</TableScrollContainer>
		</Stack>
	);
}
