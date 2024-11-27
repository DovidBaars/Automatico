'use client';

import {
	Group,
	Code,
	rem,
	Text,
	UnstyledButton,
	ThemeIcon,
	Divider,
	Flex,
	Box,
} from '@mantine/core';
import { IconGauge, IconHome2 } from '@tabler/icons-react';
import { AutomaticoLogo } from './logo';
import classes from './navBar.module.css';
import Link from 'next/link';
import { Route } from 'next';
import { STRINGS } from '@/constants/app';

export function NavBar() {
	return (
		<Box className={classes.navbar}>
			<Flex
				direction={'column'}
				justify={'space-between'}
				className={classes.glowingLine}
			>
				<Flex direction={'column'}>
					<UnstyledButton
						component={Link}
						href={STRINGS.PAGES.HOME.PATH as Route}
					>
						<Group>
							<AutomaticoLogo style={{ width: rem(120) }} />
							<ThemeIcon variant="light" size={30}>
								<IconHome2 style={{ width: rem(18), height: rem(18) }} />
							</ThemeIcon>
							<Text fw="bold">{STRINGS.PAGES.HOME.NAME}</Text>
						</Group>
					</UnstyledButton>

					<Divider my="sm" />

					<Group>
						<UnstyledButton
							component={Link}
							href={STRINGS.PAGES.DASHBOARD.PATH as Route}
						>
							<Group>
								<ThemeIcon variant="light" size={30}>
									<IconGauge style={{ width: rem(18), height: rem(18) }} />
								</ThemeIcon>
								<Text fw="bold">{STRINGS.PAGES.DASHBOARD.NAME}</Text>
							</Group>
						</UnstyledButton>
					</Group>

					<Divider my="sm" />
				</Flex>
				<Code fw={700}>v0.0.2</Code>
			</Flex>
		</Box>
	);
}
