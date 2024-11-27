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
};

export default nextConfig;
