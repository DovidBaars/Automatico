import { signIn } from '@/services/authService';

const SignInButton = () => {
    const handleSignIn = async () => {
        'use server'
        await signIn()
    }
    return (
        <form
            action={handleSignIn}
        >
            <button type="submit">Sign In</button>
        </form>
    )
}

export default SignInButton