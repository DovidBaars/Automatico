'use client';

import cx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { Table, ScrollArea, Checkbox, rem, TextInput, keys, UnstyledButton, Group, Text, Center, LoadingOverlay, Stack, Box, Button } from '@mantine/core';
import classes from './table.module.css';
import { Test } from '@prisma/client';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconReload } from '@tabler/icons-react';
import { getAllTests } from '@/services/testService';
import { revalidatePath } from 'next/cache';

type StringTypedTest = Record<keyof Test, string>;

interface ThProps {
    children: React.ReactNode;
    reversed: boolean;
    sorted: boolean;
    onSort(): void;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
    const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
    return (
        <Table.Th className={classes.th}>
            <UnstyledButton onClick={onSort} className={classes.control}>
                <Group justify="space-between">
                    <Text fw={500} fz="sm">
                        {children}
                    </Text>
                    <Center className={classes.icon}>
                        <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    </Center>
                </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

function filterData(data: StringTypedTest[], search: string) {
    const query = search.toLowerCase().trim();
    return data.filter((item) =>
        keys(data[0]).some((key) => typeof item[key] === 'string' ? item[key].toLowerCase().includes(query) : false)
    );
}

function sortData(
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

    })
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

export function TestTable() {
    const [scrolled, setScrolled] = useState(false);
    const [selection, setSelection] = useState(['1']);
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState<Test[] | StringTypedTest[]>([]);
    const [sortBy, setSortBy] = useState<keyof Test | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [unsortedData, setUnsortedData] = useState<Test[]>([]);

    const fetchData = useCallback(async (forceReload = false) => {
        const data = await getAllTests(forceReload);
        setUnsortedData(data);
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search }));
    }, [sortBy, reverseSortDirection, search]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleReload = () => {
        fetchData(true);
    }

    const toggleRow = (id: string) =>
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        );
    const toggleAll = () =>
        setSelection((current) => (current.length === sortData.length ? [] : sortedData.map((item) => item.id)));

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(unsortedData, { sortBy, reversed: reverseSortDirection, search: value }));
    };

    const setSorting = (field: keyof Test) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(unsortedData, { sortBy: field, reversed, search }));
    };


    const rows = sortedData.map((row: Test | StringTypedTest) => {
        const selected = selection.includes(row.id);
        return (
            <Table.Tr key={row.id} className={cx({ [classes.rowSelected]: selected })}>
                <Table.Td>
                    <Checkbox checked={selection.includes(row.id)} onChange={() => toggleRow(row.id)} />
                </Table.Td>
                <Table.Td>{row.id}</Table.Td>
                <Table.Td>{row.name}</Table.Td>
            </Table.Tr>
        )
    });

    const sortHeader = (
        <Table.Thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
            <Table.Tr>
                <Table.Th style={{ width: rem(40) }}>
                    <Checkbox
                        onChange={toggleAll}
                        checked={selection.length === sortedData.length}
                        indeterminate={selection.length > 0 && selection.length !== sortData.length}
                    />
                </Table.Th>
                <Th
                    sorted={sortBy === 'id'}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting('id')}
                >
                    Id
                </Th>
                <Th
                    sorted={sortBy === 'name'}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting('name')}
                >
                    Name
                </Th>
            </Table.Tr>
        </Table.Thead>
    )

    const searchHeader = (
        <Box className={classes.stickyHeader}>
            <Group justify="space-between" align="flex-start">
                <TextInput
                    placeholder="Search by any field"
                    mb="md"
                    leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
                    value={search}
                    onChange={handleSearchChange}
                    style={{ flex: 1 }}
                />
                <Button
                    onClick={handleReload}
                    variant="light"
                    leftSection={<IconReload style={{ width: rem(16), height: rem(16) }} />}
                >
                    Reload
                </Button>
            </Group>
        </Box>
    )

    return (
        <Stack h="100vh">
            {searchHeader}
            <ScrollArea style={{ flex: 1 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                <LoadingOverlay visible={unsortedData.length === 0} />
                <Table miw={700} horizontalSpacing="md" verticalSpacing="xs" layout="fixed">
                    {sortHeader}
                    <Table.Tbody>
                        {rows.length > 0 ? (
                            rows
                        ) : (
                            <Table.Tr>
                                <Table.Td colSpan={3}>
                                    <Text fw={500} ta="center">
                                        Nothing found
                                    </Text>
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </ScrollArea>
        </Stack >
    );
}