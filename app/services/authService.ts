import { authConfig } from '../../auth/auth.config';
import NextAuth from 'next-auth';

const {
	auth,
	handlers,
	signIn: nextSignIn,
	signOut: nextSignOut,
} = NextAuth(authConfig);

export { auth, handlers };

export const signOut = async () => {
	'use server';
	await nextSignOut();
};

export const signIn = async () => {
	'use server';
	await nextSignIn();
};
