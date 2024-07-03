// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	reactStrictMode: true,
	experimental: {
		typedRoutes: true,
		optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
	},
};

export default nextConfig;
