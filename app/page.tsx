'use server';

import { SignOutButton, SignInButton } from "@/components/auth";
import { getUserName } from "./services/authService";
import { AppShellMain } from "@mantine/core";

const Home = async () => {
    const userName = await getUserName()
    return (
        <AppShellMain>
            <div>
                <h1>Home Screen</h1>
                <p>Session: {userName}</p>
                <SignOutButton />
                <SignInButton />
            </div>
        </AppShellMain>
    )
}

export default Home
