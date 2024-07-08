import { Group, Badge, Text } from '@mantine/core';
import { $Enums } from '@prisma/client';

const TestTypeBadge = ({ testType }: { testType: $Enums.TestType }) => {
	return (
		<Group justify="space-between">
			<Text fw={700}>Test Details</Text>
			<Badge color="blue">{testType}</Badge>
		</Group>
	);
};

export default TestTypeBadge;
