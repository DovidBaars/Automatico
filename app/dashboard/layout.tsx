'use server';

import { AsideBar } from "@/components/asideBar/asideBar";
import { AppShellAside, AppShellMain } from "@mantine/core";

const DashboardLayout = ({ children }) => {

    return (
        <>
            <AppShellAside >
                <AsideBar />
            </AppShellAside>
            <AppShellMain>
                {children}
            </AppShellMain>

        </>
    )
};

export default DashboardLayout;