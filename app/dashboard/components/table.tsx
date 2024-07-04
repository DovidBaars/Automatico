'use client';

import cx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import { Table, ScrollArea, Checkbox, rem, TextInput, Group, Text, LoadingOverlay, Stack, Box, Button } from '@mantine/core';
import classes from './table.module.css';
import { Test } from '@prisma/client';
import { IconSearch, IconReload, IconRun, IconGlass } from '@tabler/icons-react';
import { getAllTests, getTestById, runTest } from '@/services/testService';
import SortedThComponent from './sortedTh';
import { sortData } from '../util';

export type StringTypedTest = Record<keyof Test, string>;

export default function TestTable() {
    const [scrolled, setScrolled] = useState(false);
    const [selection, setSelection] = useState<Test['id'][]>([]);
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState<Test[] | StringTypedTest[]>([]);
    const [sortBy, setSortBy] = useState<keyof Test | null>(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [unsortedData, setUnsortedData] = useState<Test[]>([]);
    const [loading, setLoading] = useState(false)

    const fetchData = useCallback(async (forceReload = false) => {
        const data = await getAllTests(forceReload);
        setUnsortedData(data);
        setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search }));
    }, [sortBy, reverseSortDirection, search]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleReload = () => {
        console.log('Data:', unsortedData[0].id);
        fetchData(true);
    }

    const handleRun = async () => {
        await runTest(selection[0]);
    }

    const handleView = async () => {
        const testId = selection[0];
        const test = await getTestById(testId);
        console.log('Viewing test. id: ', testId, ' -- ', test);
    }

    const toggleRow = (id: Test['id']) => {
        console.log(id);
        setSelection((current) =>
            current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
        )
    }
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
                <SortedThComponent
                    sorted={sortBy === 'id'}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting('id')}
                >
                    Id
                </SortedThComponent>
                <SortedThComponent
                    sorted={sortBy === 'name'}
                    reversed={reverseSortDirection}
                    onSort={() => setSorting('name')}
                >
                    Name
                </SortedThComponent>
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
                <Button
                    onClick={handleRun}
                    variant="light"
                    leftSection={<IconRun style={{ width: rem(16), height: rem(16) }} />}
                >
                    Run
                </Button>
                <Button
                    onClick={handleView}
                    variant="light"
                    leftSection={<IconGlass style={{ width: rem(16), height: rem(16) }} />}
                >
                    View
                </Button>
            </Group>
        </Box>
    )

    return (
        <Stack h="100vh">
            {searchHeader}
            <ScrollArea style={{ flex: 1 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
                <LoadingOverlay visible={loading} />
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