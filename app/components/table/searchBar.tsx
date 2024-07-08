import { Table, TextInput, rem, Tooltip, Button, Flex } from '@mantine/core';
import { IconSearch, IconReload, IconTrash } from '@tabler/icons-react';

interface ISearchBar {
	search: string;
	handleSearchChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
	handleReload: () => void;
	handleBatchDelete: () => void;
	batchSelection: boolean;
}

const SearchBar = ({
	search,
	handleSearchChange,
	handleReload,
	handleBatchDelete,
	batchSelection,
}: ISearchBar) => {
	return (
		<Table.Thead>
			<Table.Tr>
				<Table.Th colSpan={4}>
					<Flex direction="row" justify={'space-between'} gap={'xs'}>
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
								disabled={!batchSelection}
							>
								<IconTrash style={{ width: rem(16), height: rem(16) }} />
							</Button>
						</Tooltip>
					</Flex>
				</Table.Th>
			</Table.Tr>
		</Table.Thead>
	);
};

export default SearchBar;
