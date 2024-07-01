import { NextResponse } from 'next/server';
import { STRINGS } from '@/constants/app';
import { AuthService } from '@/services/authService';

const protectedRoutes = Object.values(STRINGS.PAGES)
	.filter((page) => page.PROTECTED)
	.map((page) => page.PATH);

const { auth } = AuthService;

export default auth(async (req) => {
	if (!protectedRoutes.includes(req.nextUrl.pathname) || req.auth) return;
	const newUrl = new URL(STRINGS.PAGES.HOME.PATH, req.nextUrl.origin);
	newUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
	return NextResponse.redirect(newUrl);
});

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
