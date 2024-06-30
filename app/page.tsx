'use server';

import { SignOutButton, SignInButton } from "@/components/auth";
import { getCurrentUser } from "./services/userService";

const Home = async () => {
    const userName = (await getCurrentUser())?.name
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