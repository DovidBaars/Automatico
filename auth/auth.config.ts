import { type NextAuthConfig } from 'next-auth';
import { authDbAdapter } from '../db/db.adapter';
import { authProvider } from './auth.provider';

export const authConfig: NextAuthConfig = {
	providers: authProvider,
	adapter: authDbAdapter,
	secret: process.env.AUTH_SECRET,
	session: { strategy: 'jwt' },
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				token.userId = user.id;
				token.email = user.email || token.email;
				token.provider = account.provider;
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.userId as string;
				session.user.email = token.email as string;
				session.provider = token.provider as string;
			}
			return session;
		},
	},
	debug: process.env.NODE_ENV === 'development',
};
