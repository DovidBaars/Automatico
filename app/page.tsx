'use server';

import { auth } from '@/auth'
import { SignOutButton, SignInButton } from "@/components/auth";

const Home = async () => {
    const authSession = await auth();
    return (
        <div>
            <h1>Home Screen</h1>
            <p>Session: {authSession?.user?.email}</p>
            <SignOutButton />
            <SignInButton />
        </div>
    )
}

export default Home