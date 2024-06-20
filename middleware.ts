import { NextResponse } from 'next/server';
import { STRINGS } from '@/constants/app';
import { auth } from '@/auth';

const protectedRoutes = Object.values(STRINGS.PAGES)
	.filter((page) => page.PROTECTED)
	.map((page) => page.PATH);

export default auth(async (req) => {
	console.log(
		'Auth middleware. Auth: %s, Pathname: %s, CallbackUrl: %s',
		req.auth,
		req.nextUrl.pathname,
		req.nextUrl.searchParams.get('callbackUrl')
	);
	try {
		if (!protectedRoutes.includes(req.nextUrl.pathname) || req.auth) return;
		const newUrl = new URL(STRINGS.PAGES.HOME.PATH, req.nextUrl.origin);
		newUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
		return NextResponse.redirect(newUrl);
	} catch (error) {
		console.error('Error in auth middleware:', error);
		// return NextResponse.redirect(new URL('/error', req.nextUrl.origin));
	}
});

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
