import { Table, Checkbox } from '@mantine/core';
import { TestWithSteps } from 'app/providers/test';

interface ITableHeader {
	toggleAll: () => void;
	batchSelection: string[];
	userTests: TestWithSteps[];
}

const TableHeader = ({
	toggleAll,
	batchSelection,
	userTests,
}: ITableHeader) => {
	return (
		<Table.Thead>
			<Table.Tr>
				<Table.Th>
					<Checkbox
						onChange={toggleAll}
						checked={batchSelection.length === userTests.length}
						indeterminate={
							batchSelection.length > 0 &&
							batchSelection.length !== userTests.length
						}
					/>
				</Table.Th>
				<Table.Th>URL</Table.Th>
				<Table.Th>Name</Table.Th>
				<Table.Th>Actions</Table.Th>
			</Table.Tr>
		</Table.Thead>
	);
};

export default TableHeader;
