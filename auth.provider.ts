import Google from 'next-auth/providers/google';

const GOOGLE_CLIENT_ID = process.env.AUTH_GOOGLE_ID;
const GOOGLE_CLIENT_SECRET = process.env.AUTH_GOOGLE_SECRET;

export const authProvider = [
	Google({
		clientId: GOOGLE_CLIENT_ID,
		clientSecret: GOOGLE_CLIENT_SECRET,
		authorization: {
			params: {
				prompt: 'consent',
				access_type: 'offline',
				response_type: 'code',
			},
		},
	}),
];
