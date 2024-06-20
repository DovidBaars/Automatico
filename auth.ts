import NextAuth, { type NextAuthConfig } from 'next-auth';
import { authAdapter } from './auth.adapter';
import { authProvider } from './auth.provider';

const authConfig: NextAuthConfig = {
	providers: authProvider,
	adapter: authAdapter,
	secret: process.env.AUTH_SECRET,
	session: { strategy: 'jwt' },
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		session({ session, token }) {
			session.user.id = `${token.id}`;
			return session;
		},
	},
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
