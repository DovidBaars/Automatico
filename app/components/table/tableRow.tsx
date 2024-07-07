import React, { useState } from 'react';
import {
	Table,
	Checkbox,
	Group,
	ActionIcon,
	Text,
	HoverCard,
	Drawer,
	Stack,
	Button,
} from '@mantine/core';
import {
	IconPlayerPlay,
	IconList,
	IconTrash,
	IconDotsVertical,
} from '@tabler/icons-react';
import classes from './tableRow.module.css';
import { TestWithSteps } from 'app/providers/testProvider';
import { StringTypedTest } from './table';
import cx from 'clsx';

interface RowProps {
	row: TestWithSteps | StringTypedTest;
	batchSelection: string[];
	toggleRow: (id: string) => void;
	handleRowClick: (row: TestWithSteps | StringTypedTest) => void;
	onRunTest: (id: string) => void;
	onDeleteTest: (id: string) => void;
	isCurrentTest: boolean;
}

const TableRow: React.FC<RowProps> = ({
	row,
	batchSelection,
	toggleRow,
	handleRowClick,
	onRunTest,
	onDeleteTest,
	isCurrentTest,
}) => {
	const [drawerOpened, setDrawerOpened] = useState(false);
	const batchSelected = batchSelection.includes(row.id);

	return (
		<>
			<Table.Tr
				key={row.id}
				className={cx(
					{ [classes.rowSelected]: isCurrentTest },
					classes.clickableRow
				)}
				onClick={() => handleRowClick(row)}
			>
				<Table.Td onClick={(e) => e.stopPropagation()}>
					<Checkbox
						checked={batchSelected}
						onChange={() => toggleRow(row.id)}
					/>
				</Table.Td>
				<Table.Td>{row.id}</Table.Td>
				<Table.Td>{row.name}</Table.Td>
				<Table.Td>
					<Group gap="xs" justify="flex-end">
						<ActionIcon
							variant="subtle"
							color="blue"
							onClick={(e) => {
								e.stopPropagation();
								onRunTest(row.id);
							}}
						>
							<IconPlayerPlay size={16} />
						</ActionIcon>
						<ActionIcon
							variant="subtle"
							color="grape"
							onClick={(e) => {
								e.stopPropagation();
								setDrawerOpened(true);
							}}
						>
							<IconList size={16} />
						</ActionIcon>
						<ActionIcon
							variant="subtle"
							color="red"
							onClick={(e) => {
								e.stopPropagation();
								onDeleteTest(row.id);
							}}
						>
							<IconTrash size={16} />
						</ActionIcon>
						<HoverCard width={280} shadow="md">
							<HoverCard.Target>
								<ActionIcon variant="subtle">
									<IconDotsVertical size={16} />
								</ActionIcon>
							</HoverCard.Target>
							<HoverCard.Dropdown>
								<Text size="sm">Test Type: {row.type}</Text>
								<Text size="sm">
									Steps: {(row as TestWithSteps).steps?.length || 'N/A'}
								</Text>
								<Text size="sm">
									Created: {new Date(row.createdAt).toLocaleDateString()}
								</Text>
							</HoverCard.Dropdown>
						</HoverCard>
					</Group>
				</Table.Td>
			</Table.Tr>
			<Drawer
				opened={drawerOpened}
				onClose={() => setDrawerOpened(false)}
				title={`Steps for ${row.name}`}
				position="right"
				size="md"
			>
				<Stack>
					{(row as TestWithSteps).steps?.map((step, index) => (
						<div key={step.id}>
							<Text fw={700}>
								Step {index + 1}: {step.type}
							</Text>
							<Text>{step.description}</Text>
						</div>
					)) || <Text>No steps available</Text>}
				</Stack>
				<Button fullWidth onClick={() => setDrawerOpened(false)} mt="xl">
					Close
				</Button>
			</Drawer>
		</>
	);
};

export default TableRow;
