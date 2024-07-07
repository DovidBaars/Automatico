import { signIn } from 'auth/auth';

const SignInButton = () => {
	const handleSignIn = async () => {
		'use server';
		await signIn();
	};
	return (
		<form action={handleSignIn}>
			<button type="submit">Sign In</button>
		</form>
	);
};

export default SignInButton;
