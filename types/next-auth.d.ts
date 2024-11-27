import 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
	interface JWT {
		userId?: string;
	}
	interface Session {
		accessToken: string;
	}
}
