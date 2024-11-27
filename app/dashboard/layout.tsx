import React from 'react';
import { AppShellAside, AppShellMain } from '@mantine/core';
import { TestWithStepProvider } from 'app/providers/test';
import { AsideBar } from '@/components/asideBar/asideBar';

type DashboardLayoutProps = {
	children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
	return (
		<TestWithStepProvider>
			<AppShellAside>
				<AsideBar />
			</AppShellAside>
			<AppShellMain>{children}</AppShellMain>
		</TestWithStepProvider>
	);
};

export default DashboardLayout;
