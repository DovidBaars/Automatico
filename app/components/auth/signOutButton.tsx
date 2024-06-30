import { signOut } from "@/services/authService";

const SignOutButton = () => {
    const handleSignOut = async () => {
        'use server'
        await signOut()
    }
    return (
        <form
            action={handleSignOut}
        >
            <button type="submit">Sign Out</button>
        </form>
    )
}

export default SignOutButton;