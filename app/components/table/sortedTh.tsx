import { Table, UnstyledButton, Group, Center, rem, Text } from '@mantine/core';
import {
	IconChevronUp,
	IconChevronDown,
	IconSelector,
} from '@tabler/icons-react';
import classes from './sortedTh.module.css';

interface SortedThComponentProps {
	children: React.ReactNode;
	reversed: boolean;
	sorted: boolean;
	onSort(): void;
}

const SortedThComponent = ({
	children,
	reversed,
	sorted,
	onSort,
}: SortedThComponentProps) => {
	const Icon = sorted
		? reversed
			? IconChevronUp
			: IconChevronDown
		: IconSelector;
	return (
		<Table.Th>
			<UnstyledButton onClick={onSort} className={classes.control}>
				<Group justify="space-between">
					<Text fw={500} fz="sm" p="0" m="0">
						{children}
					</Text>
					<Center className={classes.icon}>
						<Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
					</Center>
				</Group>
			</UnstyledButton>
		</Table.Th>
	);
};

export default SortedThComponent;
