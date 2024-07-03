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
				return {
					...token,
					userId: user.id,
					email: user.email,
				};
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					id: token.userId as string,
				},
			};
		},
	},
	jwt: {
		maxAge: 60 * 60 * 24 * 30, // 30 days
	},
	debug: process.env.NODE_ENV === 'development',
};
