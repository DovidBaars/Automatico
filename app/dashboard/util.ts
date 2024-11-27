import { keys } from '@mantine/core';
import { TestWithSteps } from 'app/providers/test';

export function filterData(data: TestWithSteps[], search: string) {
	const query = search.toLowerCase().trim();
	return data.filter((item) =>
		keys(data[0]).some((key) =>
			typeof item[key] === 'string'
				? item[key].toLowerCase().includes(query)
				: false
		)
	);
}
