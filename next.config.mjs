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
	webpack: (config) => {
		config.experiments = {
			...config.experiments,
			asyncWebAssembly: true,
			layers: true,
		};
		return config;
	},
	// async headers() {
	// 	return [
	// 		{
	// 			source: '/(.*)',
	// 			headers: [
	// 				{
	// 					key: 'X-Content-Type-Options',
	// 					value: 'nosniff',
	// 				},
	// 				{
	// 					key: 'X-Frame-Options',
	// 					value: 'DENY',
	// 				},
	// 				{
	// 					key: 'X-XSS-Protection',
	// 					value: '1; mode=block',
	// 				},
	// 			],
	// 		},
	// 	]
	// }
};

export default nextConfig;
