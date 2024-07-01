'use server';

import { AuthService } from './authService';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface FetchOptions extends RequestInit {
	method?: HttpMethod;
	body?: any;
	params?: Record<string, string>;
	pathParams?: Record<string, string>;
}

function addQueryParams(url: string, params: Record<string, string>): string {
	const searchParams = new URLSearchParams(params);
	return `${url}${url.includes('?') ? '&' : '?'}${searchParams.toString()}`;
}

function replacePathParams(
	url: string,
	pathParams: Record<string, string>
): string {
	return url.replace(/:([a-zA-Z]+)/g, (match, param) => {
		if (param in pathParams) {
			return encodeURIComponent(pathParams[param]);
		}
		return match;
	});
}

async function authFetch(
	url: string,
	options: FetchOptions = {}
): Promise<Response> {
	const token = await AuthService.getUserToken();

	const defaultHeaders = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	};

	let fetchUrl = url;
	if (options.pathParams) {
		fetchUrl = replacePathParams(fetchUrl, options.pathParams);
	}
	if (options.params) {
		fetchUrl = addQueryParams(fetchUrl, options.params);
	}

	const fetchOptions: RequestInit = {
		...options,
		headers: {
			...defaultHeaders,
			...(options.headers || {}),
		},
	};

	if (options.body && typeof options.body === 'object') {
		fetchOptions.body = JSON.stringify(options.body);
	}

	try {
		const response = await fetch(fetchUrl, fetchOptions);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return response;
	} catch (error) {
		console.error('Fetch error:', error);
		throw error;
	}
}

const authGet = (
	url: string,
	options?: Omit<FetchOptions, 'method' | 'body'>
) => authFetch(url, { ...options, method: 'GET' });

const authPost = (
	url: string,
	body: any,
	options?: Omit<FetchOptions, 'method' | 'body'>
) => authFetch(url, { ...options, method: 'POST', body });

const authPut = (
	url: string,
	body: any,
	options?: Omit<FetchOptions, 'method' | 'body'>
) => authFetch(url, { ...options, method: 'PUT', body });

const authDelete = (
	url: string,
	options?: Omit<FetchOptions, 'method' | 'body'>
) => authFetch(url, { ...options, method: 'DELETE' });

const authPatch = (
	url: string,
	body: any,
	options?: Omit<FetchOptions, 'method' | 'body'>
) => authFetch(url, { ...options, method: 'PATCH', body });

export { authGet, authPost, authPut, authDelete, authPatch };
