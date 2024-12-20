import { Fira_Code, Open_Sans, Roboto } from 'next/font/google';
import {
	AppShell,
	AppShellNavbar,
	ColorSchemeScript,
	createTheme,
	MantineProvider,
	rem,
} from '@mantine/core';
import { ASIDE_WIDTH, STRINGS } from './constants/app';

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css';
import { NavBar } from './components/navBar/navBar';

export const metadata = {
	title: STRINGS.TITLE,
	description: STRINGS.DESCRIPTION,
};

const openSans = Open_Sans({ subsets: ['latin'] });
const firaCode = Fira_Code({ subsets: ['latin'] });
const roboto = Roboto({
	subsets: ['latin'],
	weight: ['400', '700'],
});

const theme = createTheme({
	fontFamily: openSans.style.fontFamily,
	fontFamilyMonospace: firaCode.style.fontFamily,
	headings: { fontFamily: roboto.style.fontFamily },
	defaultRadius: 'md',
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider theme={theme} defaultColorScheme="dark">
					<AppShell
						navbar={{
							width: rem(200),
							breakpoint: 'sm',
						}}
						aside={{
							width: rem(ASIDE_WIDTH),
							breakpoint: 'sm',
						}}
					>
						<AppShellNavbar>
							<NavBar />
						</AppShellNavbar>
						{children}
					</AppShell>
				</MantineProvider>
			</body>
		</html>
	);
}
