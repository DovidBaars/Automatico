import React from 'react';
import { Table, Flex } from '@mantine/core';
import { TestWithSteps } from 'app/providers/test';
import styles from './expandedRow.module.css';
import TestTypeBadge from './testTypeBadge';
import TestInfo from './testInfo';
import StepEntry from '../stepEntry/stepEntry';

interface ExpandedRowProps {
	test: TestWithSteps;
	colSpan: number;
	expanded: boolean;
}

const ExpandedRow: React.FC<ExpandedRowProps> = ({
	test,
	colSpan,
	expanded,
}) => {
	return (
		expanded && (
			<Table.Tr className={styles.expandedRow}>
				<Table.Td colSpan={colSpan}>
					<Flex direction={'column'} gap="xs">
						<TestTypeBadge testType={test.type} />
						<TestInfo test={test} />
						<StepEntry />
					</Flex>
				</Table.Td>
			</Table.Tr>
		)
	);
};

export default ExpandedRow;
