import { keys } from '@mantine/core';
import { Test } from '@prisma/client';
import { StringTypedTest } from '../components/table/table';

function filterData(data: StringTypedTest[], search: string) {
	const query = search.toLowerCase().trim();
	return data.filter((item) =>
		keys(data[0]).some((key) =>
			typeof item[key] === 'string'
				? item[key].toLowerCase().includes(query)
				: false
		)
	);
}

export function sortData(
	data: Test[],
	payload: { sortBy: keyof Test | null; reversed: boolean; search: string }
) {
	const stringVerifiedData = data.map((item) => {
		return keys(item).reduce((acc, key) => {
			if (typeof item[key] === 'string') {
				acc[key] = item[key];
			}

			return acc;
		}, {} as StringTypedTest);
	});
	const { sortBy } = payload;

	if (!sortBy) {
		return filterData(stringVerifiedData, payload.search);
	}

	return filterData(
		[...stringVerifiedData].sort((a, b) => {
			if (payload.reversed) {
				return b[sortBy].localeCompare(a[sortBy]);
			}

			return a[sortBy].localeCompare(b[sortBy]);
		}),
		payload.search
	);
}
