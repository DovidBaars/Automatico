import { signInAction } from './auth.actions';

const SignInButton = () => {
    return (
        <form
            action={signInAction}
        >
            <button type="submit">Sign In</button>
        </form>
    )
}

export default SignInButton