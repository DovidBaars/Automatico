'use client';

import {
	Group,
	Code,
	rem,
	Text,
	UnstyledButton,
	ThemeIcon,
	Divider,
	Transition,
} from '@mantine/core';
import { IconGauge } from '@tabler/icons-react';
import { AutomaticoLogo } from './logo';
import classes from './navBar.module.css';
import Link from 'next/link';
import { Route } from 'next';
import { STRINGS } from '@/constants/app';
import { useHover } from '@mantine/hooks';

export function NavBar() {
	const { hovered, ref } = useHover();

	return (
		<nav
			ref={ref}
			className={`${classes.navbar} ${hovered ? classes.expanded : classes.collapsed}`}
		>
			<div
				className={`${classes.glowingLine} ${hovered ? classes.dimmed : ''}`}
			></div>
			<Transition
				mounted={hovered}
				transition="fade"
				duration={400}
				timingFunction="ease"
			>
				{(styles) => (
					<div style={styles} className={classes.content}>
						<Group>
							<Link
								href={STRINGS.PAGES.HOME.PATH as Route}
								className={classes.header}
							>
								<AutomaticoLogo style={{ width: rem(120) }} />
							</Link>
						</Group>

						<Divider my="sm" />

						<Group>
							<UnstyledButton
								className={classes.link}
								component={Link}
								href={STRINGS.PAGES.DASHBOARD.PATH as Route}
							>
								<Group>
									<ThemeIcon variant="light" size={30}>
										<IconGauge style={{ width: rem(18), height: rem(18) }} />
									</ThemeIcon>
									<Text>{STRINGS.PAGES.DASHBOARD.NAME}</Text>
								</Group>
							</UnstyledButton>
						</Group>

						<Divider my="sm" />

						<Code fw={700}>v0.0.2</Code>
					</div>
				)}
			</Transition>
		</nav>
	);
}
