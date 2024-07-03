import React from 'react';
import { AsideBar } from "@/components/asideBar/asideBar";
import { AppShellAside, AppShellMain } from "@mantine/core";

type DashboardLayoutProps = {
    children: React.ReactNode;
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <>
            <AppShellAside>
                <AsideBar />
            </AppShellAside>
            <AppShellMain>
                {children}
            </AppShellMain>
        </>
    );
};

export default DashboardLayout;