'use server';

import { SignOutButton, SignInButton } from "@/components/auth";
import { getUserName } from "./services/authService";

const Home = async () => {
    const userName = await getUserName()
    return (
        <div>
            <h1>Home Screen</h1>
            <p>Session: {userName}</p>
            <SignOutButton />
            <SignInButton />
        </div>
    )
}

export default Home