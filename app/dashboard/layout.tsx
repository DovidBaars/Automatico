import React from 'react';
import { AppShellAside, AppShellMain } from '@mantine/core';
import { TestProvider } from 'app/providers/testProvider';
import { AsideBar } from '@/components/asideBar/asideBar';

type DashboardLayoutProps = {
	children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
	return (
		<TestProvider>
			<AppShellAside>
				<AsideBar />
			</AppShellAside>
			<AppShellMain>{children}</AppShellMain>
		</TestProvider>
	);
};

export default DashboardLayout;
