import React from 'react';
import { AppShellAside, AppShellFooter, AppShellMain } from '@mantine/core';
import { Footer } from '@/components/footer/footer';
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
			<AppShellFooter>
				<Footer />
			</AppShellFooter>
		</TestProvider>
	);
};

export default DashboardLayout;
