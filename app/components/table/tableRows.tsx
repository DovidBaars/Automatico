import React, { useState } from 'react';
import {
	Table,
	Checkbox,
	Group,
	ActionIcon,
	Text,
	HoverCard,
	Transition,
} from '@mantine/core';
import {
	IconPlayerPlay,
	IconList,
	IconTrash,
	IconDotsVertical,
} from '@tabler/icons-react';
import classes from './tableRows.module.css';
import { TestWithSteps } from 'app/providers/testProvider';
import cx from 'clsx';
import RowDrawer from '../rowDrawer/rowDrawer';
import ExpandedRow from './expandedRow';

interface RowProps {
	batchSelection: string[];
	toggleRow: (id: string) => void;
	handleRowClick: (row: TestWithSteps) => void;
	onRunTest: (id: string) => void;
	onDeleteTest: (id: string) => void;
	currentTest: TestWithSteps | null;
	data: TestWithSteps[];
}

const TableRows: React.FC<RowProps> = ({
	batchSelection,
	toggleRow,
	handleRowClick,
	onRunTest,
	onDeleteTest,
	currentTest,
	data,
}) => {
	const [drawerOpened, setDrawerOpened] = useState(false);

	return data.length > 0 ? (
		data.map((row) => (
			<React.Fragment key={row.id}>
				<Table.Tr
					className={cx(
						{ [classes.rowSelected]: currentTest?.id === row.id },
						classes.clickableRow
					)}
					onClick={() => handleRowClick(row)}
				>
					<RowDrawer
						opened={drawerOpened}
						onClose={() => setDrawerOpened(false)}
						test={row}
					/>
					<Table.Td onClick={(e) => e.stopPropagation()}>
						<Checkbox
							checked={batchSelection.includes(row.id)}
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
				{currentTest?.id === row.id && (
					<Transition
						mounted={currentTest?.id === row.id}
						transition={'skew-down'}
						timingFunction="ease"
					>
						{(styles) => (
							<ExpandedRow transitionStyles={styles} test={row} colSpan={4} />
						)}
					</Transition>
				)}
			</React.Fragment>
		))
	) : (
		<Table.Tr>
			<Table.Td colSpan={4}>
				<Text fw={500} ta="center">
					Nothing found
				</Text>
			</Table.Td>
		</Table.Tr>
	);
};

export default TableRows;
