'use client';

import { Group, Code, rem, Text, UnstyledButton, Box, ThemeIcon, Divider } from '@mantine/core';
import {
  IconGauge,
} from '@tabler/icons-react';
import { AutomaticoLogo } from './logo';
import classes from './navBar.module.css';
import Link from 'next/link';
import { Route } from 'next';
import { STRINGS } from '@/constants/app';

export function NavBar() {
  return (
    <nav className={classes.navbar}>

      <Link href={STRINGS.PAGES.HOME.PATH as Route} className={classes.header} >
        <AutomaticoLogo style={{ width: rem(120) }} />
      </Link>


      <Divider className={classes.divider} />

      <Group className={classes.links}>

        <UnstyledButton className={classes.link} component={Link} href={STRINGS.PAGES.DASHBOARD.PATH as Route}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <ThemeIcon variant="light" size={30}>
              <IconGauge style={{ width: rem(18), height: rem(18) }} />
            </ThemeIcon>
            <Text ml={'md'}>
              {STRINGS.PAGES.DASHBOARD.NAME}
            </Text>
          </Box>
        </UnstyledButton>

      </Group>

      <Divider className={classes.divider} />

      <Code mt={'md'} mr={'md'} fw={700}>v0.0.2</Code>

    </nav>
  );
}