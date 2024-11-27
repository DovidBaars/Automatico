'use server';

import { SignOutButton, SignInButton } from '@/components/auth';
import { getUserName } from './services/auth';
import { AppShellMain } from '@mantine/core';

const Home = async () => {
	const userName = await getUserName();
	return (
		<AppShellMain>
			<div>
				<h1>Home Screen</h1>
				<h2>
					<a href="https://github.com/DovidBaars/Automatico">
						Application Github
					</a>
				</h2>
				<h2>
					<a href="https://github.com/bennyscash1/PythonFullStackFlask">
						Testing Github
					</a>
				</h2>
				<h3>
					Test any web page, mobile application, or API with the Automatico
					testing tool. No technical skills needed.
				</h3>
				<p>Session: {userName}</p>
				<p>
					<SignOutButton />
				</p>
				<p>
					<SignInButton />
				</p>
			</div>
		</AppShellMain>
	);
};

export default Home;
