import { Table, Text } from '@mantine/core';
import { TestWithSteps } from 'app/providers/test';

const TestInfo = ({ test }: { test: TestWithSteps }) => {
	return (
		<>
			<Text size="sm">
				Description: {test.description || 'No description provided'}
			</Text>
			<Text size="sm">Base URL: {test.baseUrl || 'N/A'}</Text>
			<Text size="sm">
				Created: {new Date(test.createdAt).toLocaleString()}
			</Text>
			<Text size="sm">
				Last Updated: {new Date(test.updatedAt).toLocaleString()}
			</Text>
			<Text fw={700} mt="xs">
				Steps
			</Text>
			{test.steps && test.steps.length > 0 ? (
				<Table>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Order</Table.Th>
							<Table.Th>Type</Table.Th>
							<Table.Th>Description</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{test.steps.map((step) => (
							<Table.Tr key={step.id}>
								<Table.Td>{step.order}</Table.Td>
								<Table.Td>{step.type}</Table.Td>
								<Table.Td>{step.description}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			) : (
				<Text size="sm" c="dimmed">
					No steps defined for this test.
				</Text>
			)}
		</>
	);
};
export default TestInfo;
